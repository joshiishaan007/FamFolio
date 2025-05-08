package com.example.FamFolio_Backend.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Transaction.Transaction;
import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.user.User;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "payments",indexes = {
		@Index(name = "idx_payment_status", columnList = "payment_status"),
		@Index(name = "idx_initiated_by", columnList = "initiated_by")
})
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "source_wallet_id", nullable = false)
	private Wallet sourceWallet;

	@Column(name = "destination_type", nullable = false)
	private String destinationType;

	@Column(name = "destination_identifier", nullable = false)
	private String destinationIdentifier;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "initiated_by", nullable = false)
	private User initiatedBy;

	@Column(nullable = false, precision = 19, scale = 4)
	private BigDecimal amount;

	@Column(name = "payment_method", nullable = false)
	private String paymentMethod;

	@Column(name = "payment_purpose")
	private String paymentPurpose;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;

	@Column(name = "merchant_name")
	private String merchantName;

	@Column(name = "payment_status", nullable = false)
	private String paymentStatus;

	@Column(name = "failure_reason")
	private String failureReason;

	@Column(name = "payment_gateway_reference")
	private String paymentGatewayReference;

	@Column(name = "gateway_response")
	private String gatewayResponse;

	@Column(name = "location")
	private String location;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	// Default constructor
	public Payment() {
	}

	// Getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
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
}