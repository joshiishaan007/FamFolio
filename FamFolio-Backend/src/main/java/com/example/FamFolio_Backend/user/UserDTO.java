package com.example.FamFolio_Backend.user;

import java.time.LocalDate;

/**
 * Data Transfer Object for User entity to avoid exposing sensitive data like passwords
 * and to simplify data exchange between controller and client
 */
public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String phoneNumber;
    private String aadharNumber;
    private LocalDate dateOfBirth;
    private String role;
    
    // Default constructor
    public UserDTO() {
    }
    
    // Constructor with User entity
    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.aadharNumber = user.getAadharNumber();
        this.dateOfBirth = user.getDateOfBirth();
        this.role = user.getRole();
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
    
    // Convert DTO to User entity
    public User toEntity() {
        User user = new User();
        user.setId(this.id);
        user.setName(this.name);
        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setPhoneNumber(this.phoneNumber);
        user.setAadharNumber(this.aadharNumber);
        user.setDateOfBirth(this.dateOfBirth);
        user.setRole(this.role);
        return user;
    }
}