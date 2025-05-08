package com.example.FamFolio_Backend.Payment;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findBySourceWallet_Id(Long walletId);

    List<Payment> findByInitiatedBy_Id(Long userId);

    @Query("SELECT p FROM Payment p WHERE p.sourceWallet.id = :walletId AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByWalletIdAndDateRange(
            @Param("walletId") Long walletId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT p FROM Payment p WHERE p.initiatedBy.id = :userId AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT p FROM Payment p WHERE p.category.id = :categoryId AND p.initiatedBy.id = :userId")
    List<Payment> findByCategoryAndUser(
            @Param("categoryId") Long categoryId,
            @Param("userId") Long userId
    );
}
