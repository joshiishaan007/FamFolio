//package com.example.FamFolio_Backend.TransactionApproval;
//
//import com.example.FamFolio_Backend.Enum.TransactionStatus;
//import com.example.FamFolio_Backend.Transaction.Transaction;
//import com.example.FamFolio_Backend.Transaction.TransactionRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.example.FamFolio_Backend.TransactionApproval.TransactionApprovalService;
//import com.example.FamFolio_Backend.user.User;
//
//@Service
//public class TransactionProcessor {
//
//    @Autowired
//    private TransactionRepository transactionRepository;
//
//    @Autowired
//    private TransactionApprovalService approvalService;
//
//    /**
//     * Process a transaction - determine if it needs approval or can be processed directly
//     */
//    @Transactional
//    public Transaction processTransaction(Transaction transaction, User requester) {
//        // Set initial status
//        transaction.setStatus(TransactionStatus.INITIATED.name());
//        Transaction savedTransaction = transactionRepository.save(transaction);
//
//        // Check if the transaction requires approval
//        if (approvalService.requiresApproval(savedTransaction, requester)) {
//            // Create approval request and notify owner
//            approvalService.createApprovalRequest(savedTransaction, requester);
//            // Status is updated by createApprovalRequest
//        } else {
//            // If no approval required, process directly
//            try {
//                // Implement actual transaction processing logic here
//                savedTransaction.setStatus(TransactionStatus.COMPLETED.name());
//            } catch (Exception e) {
//                savedTransaction.setStatus(TransactionStatus.FAILED.name());
//                // Add error handling logic
//            }
//
//            savedTransaction = transactionRepository.save(savedTransaction);
//        }
//
//        return savedTransaction;
//    }
//}