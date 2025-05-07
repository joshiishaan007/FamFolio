package com.example.FamFolio_Backend.AdharVerification;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class AadhaarInitializer {

    @Bean
    @Transactional
    public CommandLineRunner initializeAadhaarRecords(AadhaarRepository aadhaarRepository) {
        return args -> {
            // Mock Aadhaar data
            List<AadhaarRecord> mockAadhaarRecords = List.of(
                    new AadhaarRecord("234598761234", "Aarav Sharma", LocalDate.of(1990, 5, 15), "Male", "aarav.sharma@example.com", "917654321098"),
                    new AadhaarRecord("345612349876", "Ananya Patel", LocalDate.of(1985, 12, 8), "Female", "ananya.patel@example.com", "919876543210"),
                    new AadhaarRecord("456723458765", "Vihaan Gupta", LocalDate.of(2000, 2, 28), "Male", "vihaan.gupta@example.com", "918765432109"),
                    new AadhaarRecord("567834567894", "Ishaan Singh", LocalDate.of(1995, 7, 19), "Male", "ishaan.singh@example.com", "916543210987"),
                    new AadhaarRecord("678945678912", "Saanvi Reddy", LocalDate.of(1988, 11, 3), "Female", "saanvi.reddy@example.com", "915432109876"),
                    new AadhaarRecord("789056789123", "Aditi Choudhary", LocalDate.of(1999, 4, 25), "Female", "aditi.choudhary@example.com", "914321098765"),
                    new AadhaarRecord("890167891234", "Reyansh Kumar", LocalDate.of(2002, 9, 12), "Male", "reyansh.kumar@example.com", "913210987654"),
                    new AadhaarRecord("901278912345", "Aaradhya Joshi", LocalDate.of(1975, 3, 30), "Female", "aaradhya.joshi@example.com", "912109876543"),
                    new AadhaarRecord("012389123456", "Mohit Malhotra", LocalDate.of(1992, 8, 17), "Male", "mohit.malhotra@example.com", "911098765432"),
                    new AadhaarRecord("123490123456", "Kavya Iyer", LocalDate.of(1983, 6, 21), "Female", "kavya.iyer@example.com", "910987654321")
            );

            // Filter out duplicates based on Aadhaar number
            Set<String> existingAadhaarNumbers = new HashSet<>();
            List<AadhaarRecord> uniqueAadhaarRecords = mockAadhaarRecords.stream()
                    .filter(record -> existingAadhaarNumbers.add(record.getAadhaarNumber()))
                    .toList();

            // Save records to the database
            uniqueAadhaarRecords.forEach(aadhaarRepository::save);

            System.out.println("Aadhaar records initialized without duplicates.");
        };
    }
}
