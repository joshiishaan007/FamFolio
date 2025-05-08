package com.example.FamFolio_Backend.Payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/external")
    @PreAuthorize("hasAnyRole('OWNER', 'MEMBER')")
    public ResponseEntity<?> processExternalPayment(@Valid @RequestBody PaymentRequestDTO paymentRequest) {
        try {
            Payment payment = paymentService.processExternalPayment(paymentRequest);
            return ResponseEntity.ok(new PaymentResponseDTO(payment));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('OWNER', 'MEMBER')")
    public ResponseEntity<?> processInternalTransfer(@Valid @RequestBody InternalTransferRequest transferRequest) {
        try {
            Payment payment = paymentService.processInternalTransfer(transferRequest);
            return ResponseEntity.ok(new PaymentResponseDTO(payment));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Additional methods for payment history, etc.
}