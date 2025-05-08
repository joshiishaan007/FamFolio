package com.example.FamFolio_Backend.Payment;

import com.example.FamFolio_Backend.Category.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class InternalTransferRequest {

    private Long sourceWalletId; // Optional, if null use user's own wallet

    @NotBlank(message = "Destination UPI ID is required")
    private String destinationUpiId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String purpose;

    private Category category;

    // Getters and setters


    public Long getSourceWalletId() {
        return sourceWalletId;
    }

    public void setSourceWalletId(Long sourceWalletId) {
        this.sourceWalletId = sourceWalletId;
    }

    public String getDestinationUpiId() {
        return destinationUpiId;
    }

    public void setDestinationUpiId(String destinationUpiId) {
        this.destinationUpiId = destinationUpiId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
