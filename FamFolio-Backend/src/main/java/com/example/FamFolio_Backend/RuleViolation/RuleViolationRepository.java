package com.example.FamFolio_Backend.RuleViolation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RuleViolationRepository extends JpaRepository<RuleViolation, Long> {

    @Query("SELECT rv.violationNotes FROM RuleViolation rv WHERE rv.transaction.id = :transactionId")
    List<String> findViolationNotesByTransaction_Id(Long transactionId);
}
