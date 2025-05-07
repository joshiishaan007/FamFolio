package com.example.FamFolio_Backend.AdharVerification;


public class OtpValidationRequest {

    private String aadhaarNumber;
    private String otp;

    // Constructors
    public OtpValidationRequest() {}

    public OtpValidationRequest(String aadhaarNumber, String otp) {
        this.aadhaarNumber = aadhaarNumber;
        this.otp = otp;
    }

    // Getters and Setters
    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

           
}
