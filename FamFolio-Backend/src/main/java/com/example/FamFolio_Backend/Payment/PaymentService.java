package com.example.FamFolio_Backend.Payment;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Category.CategoryRepository;
import com.example.FamFolio_Backend.Exception.*;
import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.Transaction.TransactionService;
import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.Wallet.WalletService;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import com.example.FamFolio_Backend.user.UserResponseDTO;
import com.example.FamFolio_Backend.user.UserService;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final UserService userService;
    private final UserRelationshipService userRelationshipService;
    private final CategoryRepository categoryRepository;

    @Autowired
    public PaymentService(UserRepository userRepository, PaymentRepository paymentRepository,
                          WalletService walletService,
                          TransactionService transactionService,
                          UserService userService,
                          UserRelationshipService userRelationshipService,
                          CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.walletService = walletService;
        this.transactionService = transactionService;
        this.userService = userService;
        this.userRelationshipService = userRelationshipService;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Payment processExternalPayment(PaymentRequestDTO paymentRequest) {
        // Get current authenticated user
        User currentUser = getCurrentUser();
        User user;

        // Determine the source wallet based on request
        Wallet sourceWallet;

        if (paymentRequest.getUsername() != null) {
            // If source wallet ID is provided, check access

            user=userRepository.findByUsername(paymentRequest.getUsername()).get();
            sourceWallet = user.getWallets();

            // Check if user can use this wallet
            verifyWalletAccess(currentUser, sourceWallet);
        } else {
            // Default to user's own wallet
            sourceWallet = currentUser.getWallets();
        }

        // Check if wallet is active
        if (!sourceWallet.getIsActive()) {
            throw new PaymentProcessingException("Source wallet is inactive");
        }

        // Check if there's enough balance
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

        Category category = categoryRepository.findById(paymentRequest.getCategoryId())
                .orElseThrow(()->new EntityNotFoundException("Category not found"));

        payment.setCategory(category);
        payment.setMerchantName(paymentRequest.getMerchantName());
        payment.setPaymentStatus("PROCESSING");
        payment.setLocation(paymentRequest.getLocation());

        Payment savedPayment = paymentRepository.save(payment);

        try {
            // Process payment via payment gateway (simulated)
            boolean paymentSuccess = processPaymentGateway(savedPayment);

            if (paymentSuccess) {
                // Update wallet balance
                walletService.deductAmount(sourceWallet.getId(), paymentRequest.getAmount());

                // Update payment status
                savedPayment.setPaymentStatus("COMPLETED");
                savedPayment.setPaymentGatewayReference("PG-" + System.currentTimeMillis());
                savedPayment.setGatewayResponse("Payment processed successfully");

                // Create transaction record
                Transaction transaction = transactionService.createTransaction(
                        sourceWallet,
                        currentUser,
                        savedPayment,
                        paymentRequest.getAmount().negate(),
                        "DEBIT",
                        category,
                        paymentRequest.getMerchantName(),
                        paymentRequest.getPaymentPurpose(),
                        "COMPLETED",
                        null
                );
            } else {
                // Mark payment as failed
                savedPayment.setPaymentStatus("FAILED");
                savedPayment.setFailureReason("Payment gateway processing failed");
            }

            return paymentRepository.save(savedPayment);

        } catch (Exception e) {
            // Handle payment failure
            savedPayment.setPaymentStatus("FAILED");
            savedPayment.setFailureReason(e.getMessage());
            paymentRepository.save(savedPayment);
            throw new PaymentProcessingException("Payment processing failed: " + e.getMessage());
        }
    }

    @Transactional
    public Payment processInternalTransfer(InternalTransferRequest transferRequest) {
        // Get current authenticated user
        User currentUser = getCurrentUser();
        User user;

        // Get source wallet (sender)
        Wallet sourceWallet;
        if (transferRequest.getUsername() != null) {
            user=userRepository.findByUsername(transferRequest.getUsername()).get();
            sourceWallet = user.getWallets();
            // Verify user can access this wallet
            verifyWalletAccess(currentUser, sourceWallet);
        } else {
            sourceWallet = currentUser.getWallets();
        }

        // Get destination wallet by UPI ID
        Wallet destinationWallet = walletService.getWalletByUpiId(transferRequest.getDestinationUpiId());
        if (destinationWallet == null) {
            throw new ResourceNotFoundException("Destination wallet not found with UPI ID: " + transferRequest.getDestinationUpiId());
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
        payment.setDestinationIdentifier(transferRequest.getDestinationUpiId());
        payment.setInitiatedBy(currentUser);
        payment.setAmount(transferRequest.getAmount());
        payment.setPaymentMethod("UPI_TRANSFER");
        payment.setPaymentPurpose(transferRequest.getPurpose());
        payment.setCategory(transferRequest.getCategory());
        payment.setPaymentStatus("PROCESSING");

        Payment savedPayment = paymentRepository.save(payment);

        try {
            // Deduct from source wallet
            walletService.deductAmount(sourceWallet.getId(), transferRequest.getAmount());

            // Add to destination wallet
            walletService.addAmount(destinationWallet.getId(), transferRequest.getAmount());

            // Update payment status
            savedPayment.setPaymentStatus("COMPLETED");
            savedPayment.setPaymentGatewayReference("INTERNAL-" + System.currentTimeMillis());

            // Create sender transaction (debit)
            Transaction senderTransaction = transactionService.createTransaction(
                    sourceWallet,
                    currentUser,
                    savedPayment,
                    transferRequest.getAmount().negate(),
                    "DEBIT",
                    transferRequest.getCategory(),
                    null,
                    "Transfer to " + destinationWallet.getUpiId(),
                    "COMPLETED",
                    null
            );

            // Create receiver transaction (credit)
            Transaction receiverTransaction = transactionService.createTransaction(
                    destinationWallet,
                    destinationWallet.getUser(),
                    savedPayment,
                    transferRequest.getAmount(),
                    "CREDIT",
                    transferRequest.getCategory(),
                    null,
                    "Transfer from " + sourceWallet.getUpiId(),
                    "COMPLETED",
                    null
            );

            return paymentRepository.save(savedPayment);

        } catch (Exception e) {
            // Handle payment failure
            savedPayment.setPaymentStatus("FAILED");
            savedPayment.setFailureReason(e.getMessage());
            paymentRepository.save(savedPayment);
            throw new PaymentProcessingException("Transfer processing failed: " + e.getMessage());
        }
    }

    private boolean processPaymentGateway(Payment payment) {
        // This would integrate with a real payment gateway
        // For simulation, we'll assume success for most payments
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

    // Additional methods for querying payment history, etc.
}