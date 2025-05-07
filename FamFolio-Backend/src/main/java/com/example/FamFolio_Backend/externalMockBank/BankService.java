package com.example.FamFolio_Backend.externalMockBank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/Bank/api")
public class BankService {

    private static final BigDecimal MAX_CARD_AMOUNT = new BigDecimal("10500.00");
    private static final BigDecimal MAX_UPI_AMOUNT = new BigDecimal("8500.00");

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UpiRepository upiRepository;


    public Boolean isValidCardAndBalanceAvailable(
            String cardNumber, BigDecimal amount) {

        // Basic validation
        if (cardNumber == null || cardNumber.trim().isEmpty() || amount == null) {
            return false;
        }

        // Check amount limit
        if (amount.compareTo(MAX_CARD_AMOUNT) >= 0) {
            return false;
        }

        // Verify card exists
        return cardRepository.existsByCardNumber(cardNumber);

    }

    public Boolean isValidUpiAndBalanceAvailable(
           String upiId, String pin, BigDecimal amount) {

        // Basic validation
        if (upiId == null || upiId.trim().isEmpty() ||
                pin == null || pin.trim().isEmpty() || amount == null) {
            return false;
        }

        // Check amount limit
        if (amount.compareTo(MAX_UPI_AMOUNT) >= 0) {
            return false;
        }

        // Verify UPI credentials
        return upiRepository.existsByNameAndPassword(upiId, pin);

    }

    // Additional mock banking APIs
    @PostMapping("/mock/transaction")
    public ResponseEntity<String> mockTransaction(
            @RequestParam String transactionId,
            @RequestParam BigDecimal amount) {
        // In a real implementation, this would process the transaction
        return ResponseEntity.ok("Mock transaction " + transactionId + " for ₹" + amount + " processed successfully");
    }
}