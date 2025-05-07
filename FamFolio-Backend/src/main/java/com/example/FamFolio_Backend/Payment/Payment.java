	package com.example.FamFolio_Backend.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_id", nullable = false, unique = true, length = 100)
    private String transactionId;
    
    @ManyToOne
    @JoinColumn(name = "source_wallet_id", nullable = false)
    private Wallet sourceWallet;
    
    @Column(name = "destination_type", nullable = false, length = 20)
    private String destinationType;
    
    @Column(name = "destination_identifier", nullable = false, length = 100)
    private String destinationIdentifier;
    
    @ManyToOne
    @JoinColumn(name = "initiated_by", nullable = false)
    private User initiatedBy;
    
    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;
    
    @Column(name = "payment_method", nullable = false, length = 20)
    private String paymentMethod;
    
    @Column(name = "payment_purpose", length = 100)
    private String paymentPurpose;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "merchant_name", length = 255)
    private String merchantName;
    
    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus;
    
    @Column(name = "failure_reason")
    private String failureReason;
    
    @Column(name = "payment_gateway_reference", length = 100)
    private String paymentGatewayReference;
    
    @Column(name = "gateway_response", columnDefinition = "json")
    private String gatewayResponse;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "payment")
    private Set<Transaction> transactions = new HashSet<>();

    // Default constructor
    public Payment() {
    }
    
    // Constructor with fields
    public Payment(String transactionId, Wallet sourceWallet, String destinationType, 
                  String destinationIdentifier, User initiatedBy, BigDecimal amount, 
                  String paymentMethod, Category category) {
        this.transactionId = transactionId;
        this.sourceWallet = sourceWallet;
        this.destinationType = destinationType;
        this.destinationIdentifier = destinationIdentifier;
        this.initiatedBy = initiatedBy;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.category = category;
        this.paymentStatus = "INITIATED";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public Wallet getSourceWallet() {
		return sourceWallet;
	}

	public void setSourceWallet(Wallet sourceWallet) {
		this.sourceWallet = sourceWallet;
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

	public User getInitiatedBy() {
		return initiatedBy;
	}

	public void setInitiatedBy(User initiatedBy) {
		this.initiatedBy = initiatedBy;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getPaymentPurpose() {
		return paymentPurpose;
	}

	public void setPaymentPurpose(String paymentPurpose) {
		this.paymentPurpose = paymentPurpose;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public String getMerchantName() {
		return merchantName;
	}

	public void setMerchantName(String merchantName) {
		this.merchantName = merchantName;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getFailureReason() {
		return failureReason;
	}

	public void setFailureReason(String failureReason) {
		this.failureReason = failureReason;
	}

	public String getPaymentGatewayReference() {
		return paymentGatewayReference;
	}

	public void setPaymentGatewayReference(String paymentGatewayReference) {
		this.paymentGatewayReference = paymentGatewayReference;
	}

	public String getGatewayResponse() {
		return gatewayResponse;
	}

	public void setGatewayResponse(String gatewayResponse) {
		this.gatewayResponse = gatewayResponse;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Set<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(Set<Transaction> transactions) {
		this.transactions = transactions;
	}
    
}