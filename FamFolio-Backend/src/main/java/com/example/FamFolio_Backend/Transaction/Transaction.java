package com.example.FamFolio_Backend.Transaction;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.RuleViolation.RuleViolation;
import com.example.FamFolio_Backend.TransactionApproval.TransactionApproval;
import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;
    
    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status;
    
    @Column(name = "status_reason")
    private String statusReason;
    
    @Column(name = "upi_reference", length = 100)
    private String upiReference;
    
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;
    
    @OneToMany(mappedBy = "transaction")
    private Set<TransactionApproval> approvals = new HashSet<>();
    
    @OneToMany(mappedBy = "transaction")
    private Set<RuleViolation> ruleViolations = new HashSet<>();

    // Default constructor
    public Transaction() {
    }
    
    // Constructor with fields
    public Transaction(Wallet wallet, Payment payment, User user, BigDecimal amount, 
                      Category category, String status) {
        this.wallet = wallet;
        this.payment = payment;
        this.user = user;
        this.amount = amount;
        this.category = category;
        this.status = status;
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = ZonedDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusReason() {
        return statusReason;
    }

    public void setStatusReason(String statusReason) {
        this.statusReason = statusReason;
    }

    public String getUpiReference() {
        return upiReference;
    }

    public void setUpiReference(String upiReference) {
        this.upiReference = upiReference;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<TransactionApproval> getApprovals() {
        return approvals;
    }

    public void setApprovals(Set<TransactionApproval> approvals) {
        this.approvals = approvals;
    }

    public Set<RuleViolation> getRuleViolations() {
        return ruleViolations;
    }

    public void setRuleViolations(Set<RuleViolation> ruleViolations) {
        this.ruleViolations = ruleViolations;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        ZonedDateTime now = ZonedDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
}