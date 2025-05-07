package com.example.FamFolio_Backend.externalMockBank;

import com.example.FamFolio_Backend.externalMockBank.Card;
import com.example.FamFolio_Backend.externalMockBank.CardRepository;
import com.example.FamFolio_Backend.externalMockBank.Upi;
import com.example.FamFolio_Backend.externalMockBank.UpiRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
            if (cardRepository.count() == 0) {
                MOCK_CARD_NUMBERS.forEach(number -> {
                    Card card = new Card(number);
                    cardRepository.save(card);
                });
                System.out.println("Initialized database with 10 mock cards");
            }

            // Initialize UPIs if table is empty
            if (upiRepository.count() == 0) {
                MOCK_UPI_DATA.forEach(data -> {
                    Upi upi = new Upi(data.name, data.password);
                    upiRepository.save(upi);
                });
                System.out.println("Initialized database with 10 mock UPIs");
            }
        };
    }

    // Helper record for UPI data
    private record UpiData(String name, String password) {}
}