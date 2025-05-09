package com.example.FamFolio_Backend.Enum;

public enum TransactionStatus {
    INITIATED,        // Transaction has been created but not processed
    PENDING_APPROVAL, // Transaction is waiting for approval
    IN_PROGRESS,      // Transaction is being processed
    COMPLETED,        // Transaction has completed successfully
    FAILED,           // Transaction has failed
    CANCELLED         // Transaction was cancelled by the user
}