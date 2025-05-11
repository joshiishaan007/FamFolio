package com.example.FamFolio_Backend.Category;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class CategoryInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public CategoryInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<Category> initialCategories = List.of(
                    new Category("Groceries", "Food and household essentials", "shopping-cart"),
                    new Category("Dining Out", "Restaurants, cafes, and takeout", "utensils"),
                    new Category("Rent/Mortgage", "Housing payments", "home"),
                    new Category("Utilities", "Electricity, water, gas, etc.", "lightbulb"),
                    new Category("Internet & Phone", "Internet and mobile services", "wifi"),
                    new Category("Transportation", "Public transport, taxis, rideshares", "bus"),
                    new Category("Car Expenses", "Fuel, maintenance, insurance", "car"),
                    new Category("Health & Fitness", "Gym memberships, supplements", "dumbbell"),
                    new Category("Medical", "Doctor visits, prescriptions", "heart-pulse"),
                    new Category("Insurance", "Health, life, property insurance", "shield"),
                    new Category("Entertainment", "Movies, concerts, streaming services", "film"),
                    new Category("Shopping", "Clothing, electronics, general purchases", "shopping-bag"),
                    new Category("Travel", "Flights, hotels, vacations", "plane"),
                    new Category("Education", "Tuition, books, courses", "graduation-cap"),
                    new Category("Gifts & Donations", "Presents and charitable giving", "gift"),
                    new Category("Personal Care", "Haircuts, cosmetics, spa", "scissors"),
                    new Category("Home Maintenance", "Repairs, cleaning supplies", "tools"),
                    new Category("Investments", "Stocks, retirement contributions", "chart-line"),
                    new Category("Childcare", "Babysitting, school fees", "baby-carriage"),
                    new Category("Pet Care", "Food, vet visits, pet supplies", "paw")
            );

            categoryRepository.saveAll(initialCategories);
            System.out.println("Initialized default categories.");
        } else {
            System.out.println("Categories already present. Skipping initialization.");
        }
    }
}
