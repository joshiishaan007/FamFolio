package com.example.FamFolio_Backend.Category;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.Transaction.Transaction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "icon_name", length = 50)
    private String iconName;
    
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
    
    @OneToMany(mappedBy = "category")
    private Set<Payment> payments = new HashSet<>();
    
    @OneToMany(mappedBy = "category")
    private Set<Transaction> transactions = new HashSet<>();

    // Default constructor
    public Category() {
    }
    
    // Constructor with fields
    public Category(String name, String description, String iconName) {
        this.name = name;
        this.description = description;
        this.iconName = iconName;
        this.createdAt = ZonedDateTime.now();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Payment> getPayments() {
        return payments;
    }

    public void setPayments(Set<Payment> payments) {
        this.payments = payments;
    }

    public Set<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = ZonedDateTime.now();
    }
}