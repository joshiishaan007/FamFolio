package com.example.FamFolio_Backend.user;



public class OwnerDTO {


    private String username;
  
    private String password;
    
    private String fullName;
    private String aadhaarNumber;
    
    private String gender;
    
    private int age;
    
    private String email;

    // Default constructor
    public OwnerDTO() {
    }

    // Constructor with all fields
    public OwnerDTO(String username, String password, String fullName, String aadhaarNumber, 
                  String gender, int age, String email) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.aadhaarNumber = aadhaarNumber;
        this.gender = gender;
        this.age = age;
        this.email = email;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", aadhaarNumber='" + aadhaarNumber + '\'' +
                ", gender='" + gender + '\'' +
                ", age=" + age +
                ", email='" + email + '\'' +
                '}';
    }
}