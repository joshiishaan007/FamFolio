package com.example.FamFolio_Backend.TransactionApproval;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.FamFolio_Backend.Enum.TransactionStatus;
import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.Notification.NotificationService;
import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.Payment.PaymentRepository;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.Transaction.TransactionRepository;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;

@Service
public class TransactionApprovalService {

    private static final int APPROVAL_TIMEOUT_MINUTES = 15;

    @Autowired
    private TransactionApprovalRepository approvalRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRelationshipRepository userRelationshipRepository;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Transactional
    public TransactionApproval createApprovalRequest(Payment transaction, User requestedBy, User owner) {
        // Create approval request with PENDING status
        TransactionApproval approval = new TransactionApproval(transaction, requestedBy, "PENDING");

        System.out.println("hello");

        // Save to database
        TransactionApproval savedApproval = approvalRepository.save(approval);

        // Update transaction status to PENDING_APPROVAL
        transaction.setPaymentStatus(TransactionStatus.PENDING_APPROVAL.name());
        paymentRepository.save(transaction);

        // Send notification to owner
        notificationService.sendApprovalRequestNotification(
                owner,
                savedApproval,
                "Transaction approval required",
                "A transaction of amount " + transaction.getAmount() + " requires your approval"
        );

        // Schedule automatic rejection after timeout
        scheduleAutomaticRejection(savedApproval.getId());

        return savedApproval;
    }

    /**
     * Schedule automatic rejection after timeout period
     */
    private void scheduleAutomaticRejection(Long approvalId) {
        scheduler.schedule(() -> {
            try {
                autoRejectExpiredRequest(approvalId);
            } catch (Exception e) {
                // Log error
                System.err.println("Error during auto-rejection: " + e.getMessage());
            }
        }, APPROVAL_TIMEOUT_MINUTES, TimeUnit.MINUTES);
    }

    /**
     * Automatically reject an approval request after timeout
     */
    @Transactional
    public void autoRejectExpiredRequest(Long approvalId) {
        Optional<TransactionApproval> optionalApproval = approvalRepository.findById(approvalId);

        if (optionalApproval.isPresent()) {
            TransactionApproval approval = optionalApproval.get();

            // Only reject if still pending
            if ("PENDING".equals(approval.getStatus())) {
                approval.setStatus("REJECTED");
                approval.setApprovalNotes("Automatically rejected due to timeout after " + APPROVAL_TIMEOUT_MINUTES + " minutes");
                approvalRepository.save(approval);

                // Update transaction status
                Payment transaction = approval.getTransaction();
                transaction.setPaymentStatus(TransactionStatus.FAILED.name());
                paymentRepository.save(transaction);

                // Notify user that request was rejected
                notificationService.sendApprovalResultNotification(
                        approval.getRequestedBy(),
                        approval,
                        "Transaction rejected",
                        "Your transaction was automatically rejected due to timeout"
                );
            }
        }
    }

    /**
     * Process an approval decision (approve or reject)
     */
    @Transactional
    public TransactionApproval processApprovalDecision(Long approvalId, User approver, boolean approved, String notes) {
        Optional<TransactionApproval> optionalApproval = approvalRepository.findById(approvalId);

        if (optionalApproval.isPresent()) {
            TransactionApproval approval = optionalApproval.get();

            // Only process if still pending
            if ("PENDING".equals(approval.getStatus())) {
                String newStatus = approved ? "APPROVED" : "REJECTED";
                approval.setStatus(newStatus);
                approval.setApprovedBy(approver);
                approval.setApprovalNotes(notes);

                // Update transaction status
                Payment transaction = approval.getTransaction();
                if (approved) {
                    transaction.setPaymentStatus(TransactionStatus.COMPLETED.name());
                } else {
                    transaction.setPaymentStatus(TransactionStatus.FAILED.name());
                }
                paymentRepository.save(transaction);

                // Notify requester of the decision
                notificationService.sendApprovalResultNotification(
                        approval.getRequestedBy(),
                        approval,
                        approved ? "Transaction approved" : "Transaction rejected",
                        approved ? "Your transaction has been approved" : "Your transaction was rejected: " + notes
                );

                return approvalRepository.save(approval);
            } else {
                throw new IllegalStateException("Can't process approval that is not in PENDING state");
            }
        } else {
            throw new IllegalArgumentException("Approval request not found");
        }
    }

    /**
     * Get all pending approval requests for a specific owner/admin
     */
    public List<TransactionApproval> getPendingApprovals(String ownerUsername) {
        List<TransactionApproval> lists = approvalRepository.findByStatusOrderByCreatedAtDesc("PENDING");
        System.out.println(2);

        List<TransactionApproval> results = new ArrayList<>();

        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(()->new UserNotFoundException("Owner not found with username:"+ownerUsername));

        for(TransactionApproval t : lists){
            if(userRelationshipRepository.findOwnerByMember(t.getRequestedBy()).equals(owner)){
                results.add(t);
            }
            System.out.println(3);
        }
        System.out.println(results);
        return results;
    }
}
