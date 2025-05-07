package com.example.FamFolio_Backend.externalMockBank;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Upi {

<<<<<<< HEAD
    @Id @GeneratedValue
=======
    @Id  
    @GeneratedValue
>>>>>>> 1204f01cad6cd3df1edb07763642233da6d23575
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
