package com.example.FamFolio_Backend.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByUsername(String username);
    Optional<Owner> findByAadhaarNumber(String aadhaarNumber);
    boolean existsByUsername(String username);
    boolean existsByAadhaarNumber(String aadhaarNumber);
    boolean existsByEmail(String email);
}