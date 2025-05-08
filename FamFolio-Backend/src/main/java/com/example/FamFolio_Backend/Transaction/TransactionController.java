package com.example.FamFolio_Backend.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("(authentication.principal.username == @userService.getUsernameById(#userId)) or " +
            "(hasRole('OWNER') and @userRelationshipService.checkOwnerHasAccessToMember(authentication.principal.id, #userId))")
    public ResponseEntity<Page<Transaction>> getUserTransactions(
            @PathVariable Long userId,
            Pageable pageable) {

        Page<Transaction> transactions = transactionService.getTransactionsForUser(userId, pageable);
        return ResponseEntity.ok(transactions);
    }

//    @GetMapping("/wallet/{walletId}")
//    @PreAuthorize("(authentication.principal.id == @walletService.getUserIdByWalletId(#walletId)) or " +
//            "(hasRole('OWNER') and @userRelationshipService.checkOwnerHasAccessToWalletUser(authentication.principal.id, #walletId))")
//    public ResponseEntity<Page<Transaction>> getWalletTransactions(
//            @PathVariable Long walletId,
//            Pageable pageable) {
//
//        Page<Transaction> transactions = transactionService.getTransactionsForWalletId(walletId, pageable);
//        return ResponseEntity.ok(transactions);
//    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId) {
        Transaction transaction = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(transaction);
    }
}
