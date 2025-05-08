package com.example.FamFolio_Backend.Transaction;

import com.example.FamFolio_Backend.UserRelationship.UserRelationshipController;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import com.example.FamFolio_Backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
     private final UserRelationshipController userRelationshipController;
    private final UserRepository userRepository;
    @Autowired
    public TransactionController(TransactionService transactionService,UserRepository userRepository,UserRelationshipController userRelationshipController) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
        this.userRelationshipController = userRelationshipController;
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserTransactions(
            @PathVariable String username) {
               User user=userRepository.findByUsername(username).get();

        return ResponseEntity.ok(transactionService.getTransactionById(user.getId()));
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUserTransactionsAllUsers(
            @PathVariable String username) {
        User user=userRepository.findByUsername(username).get();
   List<Long> members=userRelationshipController.getIdByOwnerUsername(username);
   members.add(user.getId());
   System.out.println(members);
//   List<Transaction> transactions;
//           members.stream().map(m->transactionService.getTransactionById(m))
//                           .map(m->transactions.add(m))
//                           .forEach(p-> System.out.println(p));
//
//
//   transactions.add(transactionService.getTransactionById(user.getId()));

        List<Transaction> transactions = members.stream()
                .flatMap(m -> transactionService.getTransactionById(m).stream())
                .collect(Collectors.toList());


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
    public ResponseEntity<List<Transaction>> getTransactionById(@PathVariable Long transactionId) {
        List<Transaction> transactions = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(transactions);
    }
}
