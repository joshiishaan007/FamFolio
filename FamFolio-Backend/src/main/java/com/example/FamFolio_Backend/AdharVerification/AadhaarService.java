package com.example.FamFolio_Backend.AdharVerification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AadhaarService {

    @Autowired
    private AadhaarRepository aadhaarRepository;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> otpStore = new HashMap<>(); // Temporary in-memory OTP storage

    public ResponseEntity<?> verifyAadhaarAndSendOtp(String aadhaarNumber) {
    	System.out.println("Received Aadhaar number: " + aadhaarNumber);

        AadhaarRecord record = aadhaarRepository.findById(aadhaarNumber).orElse(null);
     
        System.out.println(record);
        if (record == null) {
            return ResponseEntity.status(404).body("Aadhaar not verified");
        }

        // Generate OTP
        String otp = generateOtp();
        otpStore.put(aadhaarNumber, otp);

        // Send OTP to email
        sendOtpEmail(record.getEmailAddress(), otp);

        return ResponseEntity.ok("OTP sent successfully to " + record.getEmailAddress());
    }

    public ResponseEntity<?> validateOtp(String aadhaarNumber, String otp) {
        if (!otpStore.containsKey(aadhaarNumber)) {
            return ResponseEntity.status(404).body("No OTP found for the given Aadhaar number");
        }

        String storedOtp = otpStore.get(aadhaarNumber);
        if (storedOtp.equals(otp)) {
            otpStore.remove(aadhaarNumber); // Clear OTP after successful validation
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000)); // Generate 6-digit OTP
    }

    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP for Aadhaar Verification");
        message.setText("Your OTP is: " + otp + "\nPlease do not share it with anyone.");
        mailSender.send(message);
    }
}
