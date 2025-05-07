package com.example.FamFolio_Backend.Wallet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    boolean existsByUpiId(String upiId);
    Wallet findByUserId(Long userId);

}