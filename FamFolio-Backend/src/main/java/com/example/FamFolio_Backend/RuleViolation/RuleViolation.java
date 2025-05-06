package com.example.FamFolio_Backend.RuleViolation;

import java.time.ZonedDateTime;

import com.example.FamFolio_Backend.Rule.Rule;
import com.example.FamFolio_Backend.Transaction.Transaction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "rule_violations")
public class RuleViolation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;
    
    @ManyToOne
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;
    
    @Column(name = "violation_notes")
    private String violationNotes;
    
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    // Default constructor
    public RuleViolation() {
    }
    
    // Constructor with fields
    public RuleViolation(Transaction transaction, Rule rule, String violationNotes) {
        this.transaction = transaction;
        this.rule = rule;
        this.violationNotes = violationNotes;
        this.createdAt = ZonedDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public Rule getRule() {
        return rule;
    }

    public void setRule(Rule rule) {
        this.rule = rule;
    }

    public String getViolationNotes() {
        return violationNotes;
    }

    public void setViolationNotes(String violationNotes) {
        this.violationNotes = violationNotes;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = ZonedDateTime.now();
    }
}