package com.example.FamFolio_Backend.externalMockBank;

import com.example.FamFolio_Backend.externalMockBank.Card;
import com.example.FamFolio_Backend.externalMockBank.CardRepository;
import com.example.FamFolio_Backend.externalMockBank.Upi;
import com.example.FamFolio_Backend.externalMockBank.UpiRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Configuration
public class MockDataInitializer {

    // Store card numbers without creating Card objects
    private static final List<String> MOCK_CARD_NUMBERS = Arrays.asList(
            "4111111111111001",
            "4111111111111002",
            "4111111111111003",
            "4111111111111004",
            "4111111111111005",
            "4111111111111006",
            "4111111111111007",
            "4111111111111008",
            "4111111111111009",
            "4111111111111010"
    );

    // Store UPI data as name/password pairs
    private static final List<UpiData> MOCK_UPI_DATA = Arrays.asList(
            new UpiData("rajesh.sharma@ybl", "password1"),
            new UpiData("priyanka.patel@upi", "password2"),
            new UpiData("amit.kumar@oksbi", "password3"),
            new UpiData("neha.gupta@axisbank", "password4"),
            new UpiData("vijay.singh@paytm", "password5"),
            new UpiData("ananya.reddy@ybl", "password6"),
            new UpiData("suresh.iyer@icici", "password7"),
            new UpiData("divya.nair@okhdfc", "password8"),
            new UpiData("arun.desai@upi", "password9"),
            new UpiData("meera.choudhary@oksbi", "password10")
    );
    @Bean
    @Transactional
    public CommandLineRunner initializeMockData(CardRepository cardRepository, UpiRepository upiRepository) {
        return args -> {
            // Initialize Cards if table is empty
            if (cardRepository.count() <10) {
                for (String cardNumber : MOCK_CARD_NUMBERS) {
                    try {
                        Card card = new Card(cardNumber);
                        cardRepository.save(card);
                    } catch (DataIntegrityViolationException e) {
                        System.err.println("Failed to insert Card: " + cardNumber + " - " + e.getMessage());
                    }
                }
                System.out.println("Card initialization attempt completed");

                // Verify inserted count
                long count = cardRepository.count();
                System.out.println("Total Cards in database: " + count);
            }

            // UPI initialization (you already have this part correctly)
            if (upiRepository.count() == 0) {
                for (UpiData data : MOCK_UPI_DATA) {
                    try {
                        Upi upi = new Upi(data.name(), data.password());
                        upiRepository.save(upi);
                    } catch (DataIntegrityViolationException e) {
                        System.err.println("Failed to insert UPI: " + data.name() + " - " + e.getMessage());
                    }
                }
                System.out.println("UPI initialization attempt completed");

                long count = upiRepository.count();
                System.out.println("Total UPIs in database: " + count);
                if (count < MOCK_UPI_DATA.size()) {
                    System.err.println("Warning: Only " + count + " out of " + MOCK_UPI_DATA.size() + " UPIs were inserted");
                }
            }
        };
    }


    // Helper record for UPI data
    private record UpiData(String name, String password) {}
}