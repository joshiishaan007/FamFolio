package com.example.FamFolio_Backend.Payment;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Category.CategoryRepository;
import com.example.FamFolio_Backend.Enum.PaymentStatus;
import com.example.FamFolio_Backend.Enum.TransactionStatus;
import com.example.FamFolio_Backend.Exception.*;
import com.example.FamFolio_Backend.Notification.NotificationService;
import com.example.FamFolio_Backend.Rule.RuleEngine;
import com.example.FamFolio_Backend.RuleAction.RuleAction;
import com.example.FamFolio_Backend.RuleViolation.RuleViolation;
import com.example.FamFolio_Backend.RuleViolation.RuleViolationRepository;
import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.Transaction.TransactionService;
import com.example.FamFolio_Backend.TransactionApproval.TransactionApprovalService;
import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.Wallet.WalletService;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import com.example.FamFolio_Backend.user.UserService;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final UserService userService;
    private final UserRelationshipService userRelationshipService;
    private final CategoryRepository categoryRepository;
    private final RuleViolationRepository ruleViolationRepository;
    private final RuleEngine ruleEngine;
    private final TransactionApprovalService transactionApprovalService;
    private final NotificationService notificationService;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
                          WalletService walletService,
                          TransactionService transactionService,
                          UserService userService,
                          UserRelationshipService userRelationshipService,
                          CategoryRepository categoryRepository,
                          RuleViolationRepository ruleViolationRepository,
                          RuleEngine ruleEngine,
                          UserRepository userRepository,
                          TransactionApprovalService transactionApprovalService,
                          NotificationService notificationService) {
        this.paymentRepository = paymentRepository;
        this.walletService = walletService;
        this.transactionService = transactionService;
        this.userService = userService;
        this.userRelationshipService = userRelationshipService;
        this.categoryRepository = categoryRepository;
        this.ruleViolationRepository = ruleViolationRepository;
        this.ruleEngine = ruleEngine;
        this.userRepository = userRepository;
        this.transactionApprovalService = transactionApprovalService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PaymentResponseDTO processExternalPayment(PaymentRequestDTO paymentRequest) {

        User currentUser = getCurrentUser();
        User user;

        Wallet sourceWallet;

        if (paymentRequest.getUsername() != null) {

            user=userService.findByUsername(paymentRequest.getUsername());
            sourceWallet = user.getWallets();
            verifyWalletAccess(currentUser, sourceWallet);

        } else {

            sourceWallet = currentUser.getWallets();
        }

        if (!sourceWallet.getIsActive()) {
            throw new PaymentProcessingException("Source wallet is inactive");
        }

        if (sourceWallet.getBalance().compareTo(paymentRequest.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in wallet");
        }

        // Create payment record
        Payment payment = new Payment();
        payment.setSourceWallet(sourceWallet);
        payment.setDestinationType(paymentRequest.getDestinationType());
        payment.setDestinationIdentifier(paymentRequest.getDestinationIdentifier());
        payment.setInitiatedBy(currentUser);
        payment.setAmount(paymentRequest.getAmount());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setPaymentPurpose(paymentRequest.getPaymentPurpose());
        payment.setMerchantName(paymentRequest.getMerchantName());
        payment.setLocation(paymentRequest.getLocation());
        if (paymentRequest.getCategoryName() != null) {
            Category category = categoryRepository.findByName(paymentRequest.getCategoryName())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            payment.setCategory(category);
        }
        payment.setPaymentStatus(PaymentStatus.INITIATED.name());
        Payment savedPayment = paymentRepository.save(payment);

        Transaction transaction = transactionService.createTransaction(
                sourceWallet,
                currentUser,
                savedPayment,
                paymentRequest.getAmount().negate(),
                "DEBIT",
                payment.getCategory(),
                paymentRequest.getMerchantName(),
                paymentRequest.getPaymentPurpose(),
                TransactionStatus.INITIATED.name(),
                generateUpiReference()
        );

        // Check if this payment requires rule validation
        try {
            validatePaymentAgainstRules(savedPayment,transaction);
        } catch (RuleViolationException e) {

            transaction.setStatus(TransactionStatus.FAILED.name());
            transaction.setFailureReason(e.getMessage());
            transactionService.updateTransaction(transaction);

            return new PaymentResponseDTO(savedPayment,transaction.getFailureReason(), transaction.getId());
        }

        try {

            boolean paymentSuccess = processPaymentGateway(savedPayment);

            if (paymentSuccess) {
                // Update wallet balance
                walletService.deductAmount(sourceWallet.getId(), paymentRequest.getAmount());

                transaction.setStatus(TransactionStatus.COMPLETED.name());
                transaction.setFailureReason("NAN");
                transactionService.updateTransaction(transaction);

                savedPayment.setPaymentStatus(PaymentStatus.COMPLETED.name());

            } else {

                savedPayment.setPaymentStatus(PaymentStatus.FAILED.name());
                savedPayment = paymentRepository.save(savedPayment);

                transaction.setStatus(TransactionStatus.FAILED.name());
                transaction.setFailureReason("Payment gateway processing failed");
                transactionService.updateTransaction(transaction);
            }

            return new PaymentResponseDTO(savedPayment,transaction.getFailureReason(), transaction.getId());

        } catch (Exception e) {
            savedPayment.setPaymentStatus(PaymentStatus.FAILED.name());
            paymentRepository.save(savedPayment);

            transaction.setStatus(TransactionStatus.FAILED.name());
            transaction.setFailureReason(e.getMessage());
            transactionService.updateTransaction(transaction);

            throw new PaymentProcessingException("Payment processing failed: " + e.getMessage());
        }
    }

    private String generateUpiReference() {
        // Generate a random UPI reference
        return "UPI" + System.currentTimeMillis() + Math.round(Math.random() * 1000);
    }

    public void validatePaymentAgainstRules(Payment payment, Transaction transaction) {
        User user = payment.getInitiatedBy();

        // Check if user is a member (rules only apply to members)
        if (user.getRole().equals("MEMBER")) {
            // Get user's owner
            User owner = userRelationshipService.getOwnerForMember(user.getId());

            if (owner != null) {
                // Evaluate payment against applicable rules
                List<RuleViolation> violations = ruleEngine.evaluatePayment(payment, owner.getId(), user.getId(), transaction);

                if (!violations.isEmpty()) {
                    // Save rule violations
                    boolean approvalTriggered = false;
                    boolean notityTriggered = false;
                    for (RuleViolation violation : violations) {
//
                        ruleViolationRepository.save(violation);

                        for (RuleAction action : violation.getRule().getActions()) {
                            String actionType = action.getActionType();

                            if ("REQUIRE_APPROVAL".equals(actionType)) {
                                transactionApprovalService.createApprovalRequest(
                                        payment,
                                        violation.getRule().getMember(),
                                        violation.getRule().getOwner()
                                );
                                transaction.setStatus(TransactionStatus.PENDING_APPROVAL.name());
                                transactionService.updateTransaction(transaction);
                                approvalTriggered = true;
                                break;
                            } else if ("NOTIFY".equals(actionType)) {
                                notificationService.sendNotification(
                                        violation.getRule().getOwner(),
                                        "User " + user.getUsername() + " triggered a rule on payment of amount: " + payment.getAmount()
                                );
                                notityTriggered = true;
                            }
                        }

                    }

                    if(!approvalTriggered && !notityTriggered){
                        payment.setPaymentStatus(PaymentStatus.FAILED.name());

                        transaction.setStatus(TransactionStatus.FAILED.name());
                        transaction.setFailureReason("Payment violates rules set by the owner");
                        transactionService.updateTransaction(transaction);

                        paymentRepository.save(payment);
                    }


                    throw new RuleViolationException("Payment violates rules set by the owner");

                }
            }
        }
    }

//    public Payment approvedPayment()

    @Transactional
    public PaymentResponseDTO processInternalTransfer(InternalTransferRequest transferRequest) {

        User currentUser = getCurrentUser();
        User owner,member;

        owner = userService.findByUsername(transferRequest.getOwnername());
        member = userService.findByUsername(transferRequest.getMembername());

        Wallet sourceWallet,destinationWallet;
        if (owner != null) {

            sourceWallet = owner.getWallets();
            verifyWalletAccess(currentUser, sourceWallet);

        } else {
            sourceWallet = currentUser.getWallets();
        }

        destinationWallet=member.getWallets();

        if (destinationWallet == null) {
            throw new ResourceNotFoundException("Destination wallet not found with UPI ID: " + destinationWallet.getUpiId());
        }

        // Check wallet status
        if (!sourceWallet.getIsActive() || !destinationWallet.getIsActive()) {
            throw new PaymentProcessingException("One of the wallets is inactive");
        }

        // Check for sufficient balance
        if (sourceWallet.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in wallet");
        }

        // Create payment record
        Payment payment = new Payment();
        payment.setSourceWallet(sourceWallet);
        payment.setDestinationType("WALLET");
        payment.setDestinationIdentifier(destinationWallet.getUpiId());
        payment.setInitiatedBy(currentUser);
        payment.setAmount(transferRequest.getAmount());
        payment.setPaymentMethod("UPI_TRANSFER");
        payment.setPaymentPurpose("Transfere to member by owner");
        payment.setCategory(null);
        payment.setPaymentStatus(PaymentStatus.INITIATED.name());
        Payment savedPayment = paymentRepository.save(payment);

        Transaction ownerTransaction = transactionService.createTransaction(
                sourceWallet,
                owner,
                savedPayment,
                transferRequest.getAmount().negate(),
                "DEBIT",
                payment.getCategory(),
                member.getName(),
                "Transfer to " + destinationWallet.getUpiId(),
                TransactionStatus.INITIATED.name(),
                destinationWallet.getUpiId()
        );

        // Check if this payment requires rule validation
        try {
            validatePaymentAgainstRules(savedPayment,ownerTransaction);
        } catch (RuleViolationException e) {

            ownerTransaction.setStatus(TransactionStatus.FAILED.name());
            ownerTransaction.setFailureReason(e.getMessage());
            transactionService.updateTransaction(ownerTransaction);

            savedPayment.setPaymentStatus(PaymentStatus.FAILED.name());
            savedPayment = paymentRepository.save(savedPayment);

            return new PaymentResponseDTO(savedPayment,ownerTransaction.getFailureReason(), ownerTransaction.getId());
        }

        try {
            // Deduct from source wallet
            walletService.deductAmount(sourceWallet.getId(), transferRequest.getAmount());

            // Add to destination wallet
            walletService.addAmount(destinationWallet.getId(), transferRequest.getAmount());

            // Update payment status
            savedPayment.setPaymentStatus(PaymentStatus.COMPLETED.name());

            ownerTransaction.setStatus(TransactionStatus.COMPLETED.name());
            ownerTransaction.setFailureReason("NAN");
            transactionService.updateTransaction(ownerTransaction);

            Transaction memberTransaction = transactionService.createTransaction(
                    member.getWallets(),
                    member,
                    savedPayment,
                    transferRequest.getAmount().plus(),
                    "CREDIT",
                    payment.getCategory(),
                    owner.getName(),
                    "Transfer from " + sourceWallet.getUpiId(),
                    TransactionStatus.COMPLETED.name(),
                    sourceWallet.getUpiId()
            );
            memberTransaction.setFailureReason("NAN");
            transactionService.updateTransaction(memberTransaction);

            savedPayment = paymentRepository.save(savedPayment);

            return new PaymentResponseDTO(savedPayment,ownerTransaction.getFailureReason(), ownerTransaction.getId());

        } catch (Exception e) {
            savedPayment.setPaymentStatus("FAILED");
            paymentRepository.save(savedPayment);

            ownerTransaction.setStatus(TransactionStatus.FAILED.name());
            ownerTransaction.setFailureReason(e.getMessage());
            transactionService.updateTransaction(ownerTransaction);

            throw new PaymentProcessingException("Transfer processing failed: " + e.getMessage());
        }
    }

    private boolean processPaymentGateway(Payment payment) {
        return true;
    }

    private void verifyWalletAccess(User user, Wallet wallet) {
        // If it's user's own wallet, allow access
        if (wallet.getUser().getId().equals(user.getId())) {
            return;
        }

        // If user is OWNER, check if they have relationship with wallet owner
        if ("OWNER".equals(user.getRole())) {
            boolean hasAccess = userRelationshipService.checkOwnerHasAccessToMember(user.getId(), wallet.getUser().getId());
            if (hasAccess) {
                return;
            }
        }

        // Access denied
        throw new UnauthorizedAccessException("You don't have access to this wallet");
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);
    }
}