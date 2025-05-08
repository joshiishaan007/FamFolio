package com.example.FamFolio_Backend.Payment;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<PaymentResponseDTO> processExternalPayment(@Valid @RequestBody PaymentRequestDTO paymentRequest) {
        Payment payment = paymentService.processExternalPayment(paymentRequest);
        return ResponseEntity.ok(new PaymentResponseDTO(payment));
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('OWNER', 'MEMBER')")
    public ResponseEntity<PaymentResponseDTO> processInternalTransfer(@Valid @RequestBody InternalTransferRequest transferRequest) {
        Payment payment = paymentService.processInternalTransfer(transferRequest);
        return ResponseEntity.ok(new PaymentResponseDTO(payment));
    }
}
