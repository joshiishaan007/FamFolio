package com.example.FamFolio_Backend.externalMockBank;

import jakarta.persistence.*;

@Entity// optional but recommended
public class Upi {

    @Id
    @GeneratedValue
    private Integer id; // use Integer, not int

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String password;

    public Upi() {
    }

    public Upi(String name, String password) {
        this.name = name;
        this.password = password;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
