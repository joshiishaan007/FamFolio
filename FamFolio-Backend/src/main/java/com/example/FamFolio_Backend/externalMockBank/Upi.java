package com.example.FamFolio_Backend.externalMockBank;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Upi {

    @Id  
    @GeneratedValue
    int id;
    String name;
    String password;


    public Upi() {
    }

    public Upi(String name, String password) {
        this.name = name;
        this.password = password;
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
