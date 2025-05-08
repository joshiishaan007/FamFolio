package com.example.FamFolio_Backend.Enum;

public enum TransactionStatus {
    PENDING,       // Transaction is in progress
    COMPLETED,     // Transaction has been successfully completed
    FAILED,        // Transaction has failed
    REFUNDED,      // Transaction has been refunded
    CANCELLED      // Transaction was cancelled
}
