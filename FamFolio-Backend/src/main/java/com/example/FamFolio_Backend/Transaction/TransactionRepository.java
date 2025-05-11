package com.example.FamFolio_Backend.Transaction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByWallet_Id(Long walletId);

    List<Transaction> findByUser_Id(Long userId);

    Page<Transaction> findByUser_Id(Long userId, Pageable pageable);

    List<Transaction> findByStatusAndWallet_Id(String status, Long walletId);

    @Query("SELECT t FROM Transaction t WHERE t.status = 'APPROVAL_PENDING' AND t.wallet.id IN " +
            "(SELECT w.id FROM Wallet w WHERE w.user.id IN " +
            "(SELECT ur.member.id FROM UserRelationship ur WHERE ur.owner.id = :ownerId))")
    List<Transaction> findPendingApprovalsByOwner(@Param("ownerId") Long ownerId);

    @Query("SELECT t FROM Transaction t WHERE t.wallet.id = :walletId AND t.status = :status " +
            "AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByWalletIdStatusAndDateRange(
            @Param("walletId") Long walletId,
            @Param("status") String status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT t FROM Transaction t WHERE t.category.id = :categoryId AND t.user.id = :userId " +
            "AND t.status = 'COMPLETED' AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findCompletedByCategoryUserAndDateRange(
            @Param("categoryId") Long categoryId,
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT new map(t.category.name as category, SUM(t.amount) as totalAmount) " +
            "FROM Transaction t " +
            "WHERE t.user.username = :username " +
            "GROUP BY t.category.name")
    List<Map<String, Object>> getCategorySpendingSummary(@Param("username") String username);

    List<Transaction> findByWalletIdAndStatus(Long id, String approvalPending);
}
