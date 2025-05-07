package com.example.FamFolio_Backend.user;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.UserRelationship.UserRelationship;
import com.example.FamFolio_Backend.Wallet.Wallet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Column(name = "phone_number", nullable = false, unique = true, length = 20)
    private String phoneNumber;
    
    @Column(name = "aadhar_number", nullable = false, unique = true, length = 12)
    private String aadharNumber;
    
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;
    
    @Column(name = "role", nullable = false)
    private String role;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "last_login", nullable = false)
    private LocalDateTime lastLogin;
    
    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Wallet wallets;
    
    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private Set<UserRelationship> ownedRelationships = new HashSet<>();
    
    @OneToMany(mappedBy = "member")
    private Set<UserRelationship> memberRelationships = new HashSet<>();
    
    @OneToMany(mappedBy = "initiatedBy")
    private Set<Payment> initiatedPayments = new HashSet<>();
    
    @OneToMany(mappedBy = "user")
    private Set<Transaction> transactions = new HashSet<>();

    public void setWallets(Wallet wallets) {
		this.wallets = wallets;
	}

	// Default constructor
    public User() {
    }


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAadharNumber() {
        return aadharNumber;
    }

    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Wallet getWallets() {
        return wallets;
    }

   
    public Set<UserRelationship> getOwnedRelationships() {
        return ownedRelationships;
    }

    public void setOwnedRelationships(Set<UserRelationship> ownedRelationships) {
        this.ownedRelationships = ownedRelationships;
    }

    public Set<UserRelationship> getMemberRelationships() {
        return memberRelationships;
    }

    public void setMemberRelationships(Set<UserRelationship> memberRelationships) {
        this.memberRelationships = memberRelationships;
    }

    public Set<Payment> getInitiatedPayments() {
        return initiatedPayments;
    }

    public void setInitiatedPayments(Set<Payment> initiatedPayments) {
        this.initiatedPayments = initiatedPayments;
    }

    public Set<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}