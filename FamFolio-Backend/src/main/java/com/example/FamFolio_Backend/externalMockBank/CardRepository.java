package com.example.FamFolio_Backend.externalMockBank;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {

    boolean existsByCardNumber(String cardNumber);
}
