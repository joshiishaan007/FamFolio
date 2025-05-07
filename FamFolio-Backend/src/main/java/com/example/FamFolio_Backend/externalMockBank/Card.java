package com.example.FamFolio_Backend.externalMockBank;

import jakarta.persistence.*;

@Entity
@Table(name = "card") // Make sure table name matches your database
public class Card {
    @Id
    @GeneratedValue // Crucial for auto-increment
    private Long id; // Use Long instead of int for IDs

    @Column(name = "card_number", unique = true) // Match your column name
    private String cardNumber;

    // Constructors, getters, setters...
    public Card() {}

    public Card(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
}