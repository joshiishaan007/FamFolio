package com.example.FamFolio_Backend.Payment;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PaymentResponseDTO {
    private Long paymentId;
    private String sourceWalletUpiId;
    private String destinationType;
    private String destinationIdentifier;
    private BigDecimal amount;
    private String paymentStatus;
    private String paymentReference;
    private LocalDateTime timestamp;
    private String failureReason;
    private Long transactionId;

    public PaymentResponseDTO(Payment payment, String reason, Long transactionId) {
        this.paymentId = payment.getId();
        this.sourceWalletUpiId = payment.getSourceWallet().getUpiId();
        this.destinationType = payment.getDestinationType();
        this.destinationIdentifier = payment.getDestinationIdentifier();
        this.amount = payment.getAmount();
        this.paymentStatus = payment.getPaymentStatus();
        this.timestamp = payment.getCreatedAt();
        this.failureReason = reason;
        this.transactionId = transactionId;
    }

    // Getters and setters


    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getSourceWalletUpiId() {
        return sourceWalletUpiId;
    }

    public void setSourceWalletUpiId(String sourceWalletUpiId) {
        this.sourceWalletUpiId = sourceWalletUpiId;
    }

    public String getDestinationType() {
        return destinationType;
    }

    public void setDestinationType(String destinationType) {
        this.destinationType = destinationType;
    }

    public String getDestinationIdentifier() {
        return destinationIdentifier;
    }

    public void setDestinationIdentifier(String destinationIdentifier) {
        this.destinationIdentifier = destinationIdentifier;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
