package com.example.FamFolio_Backend.user;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.UserRelationship.UserRelationship;
import com.example.FamFolio_Backend.Wallet.Wallet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

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
    
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;
    
    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Wallet wallets;
    
    @OneToMany(mappedBy = "owner")
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
    
    // Constructor with fields
    public User(String name, String username, String email, String passwordHash, String phoneNumber, 
                String aadharNumber, LocalDate dateOfBirth, String role) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.aadharNumber = aadharNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
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