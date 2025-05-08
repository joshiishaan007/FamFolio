package com.example.FamFolio_Backend.Enum;

public enum PaymentStatus {
    INITIATED,     // Payment has been created but processing hasn't started
    PROCESSING,    // Payment is being processed
    PENDING,       // Payment is awaiting approval or additional steps
    COMPLETED,     // Payment has been successfully processed
    FAILED,        // Payment processing has failed
    CANCELLED,     // Payment was cancelled by the user or system
    REFUNDED       // Payment was refunded
}
