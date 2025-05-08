package com.example.FamFolio_Backend.Transaction;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.Security.JwtUtil;
import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.Exception.ResourceNotFoundException;
import com.example.FamFolio_Backend.Exception.UnauthorizedAccessException;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipService;
import com.example.FamFolio_Backend.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRelationshipService userRelationshipService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository,
                              UserRelationshipService userRelationshipService,
                              UserRepository userRepository,
                              JwtUtil jwtUtil) {
        this.transactionRepository = transactionRepository;
        this.userRelationshipService = userRelationshipService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Transaction createTransaction(Wallet wallet,
                                         User user,
                                         Payment payment,
                                         BigDecimal amount,
                                         String transactionType,
                                         Category category,
                                         String merchantName,
                                         String description,
                                         String status,
                                         String upiReference) {

        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setUser(user);
        transaction.setPayment(payment);
        transaction.setAmount(amount);
        transaction.setTransactionType(transactionType);
        transaction.setCategory(category);
        transaction.setMerchantName(merchantName);
        transaction.setDescription(description);
        transaction.setStatus(status);
        transaction.setUpiReference(upiReference);

        return transactionRepository.save(transaction);
    }

    public Page<Transaction> getTransactionsForUser(Long userId, Pageable pageable) {
        // Get current user
        User currentUser = getCurrentUser();

        // Check if user is requesting their own transactions
        if (userId.equals(currentUser.getId())) {
            return transactionRepository.findByUser_Id(userId, pageable);
        }

        // If OWNER role, check if they have access to the member's transactions
        if ("OWNER".equals(currentUser.getRole())) {
            boolean hasAccess = userRelationshipService.checkOwnerHasAccessToMember(currentUser.getId(), userId);
            if (hasAccess) {
                return transactionRepository.findByUser_Id(userId, pageable);
            }
        }

        throw new UnauthorizedAccessException("You don't have access to these transactions");
    }

//    public Page<Transaction> getTransactionsForWalletId(Long walletId, Pageable pageable) {
//        // Get current user
//        User currentUser = getCurrentUser();
//
//        // The service layer should handle access control
//        // This will be implemented in a real scenario based on relationship checks
//
//        return transactionRepository.findByWalletId(walletId, pageable);
//    }

    public List<Transaction> getTransactionById(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUser_Id(userId);
        return transactions;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(()->new UserNotFoundException("User not found"));
    }
}
