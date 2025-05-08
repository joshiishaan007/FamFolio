package com.example.FamFolio_Backend;


import com.example.FamFolio_Backend.Exception.*;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.ControllerAdvice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle Entity Not Found
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Handle Insufficient Balance
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientBalance(InsufficientBalanceException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Insufficient balance: " + ex.getMessage());
    }

    // Handle Unauthorized Access
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedAccess(UnauthorizedAccessException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // Handle Payment Processing Errors
    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<ErrorResponse> handlePaymentProcessing(PaymentProcessingException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Payment processing failed: " + ex.getMessage());
    }

    // Handle Resource Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Handle Validation Errors on Request Body
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // Handle Validation Errors on Query Params / Path Vars
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation error: " + ex.getMessage());
    }

    // Handle Type Mismatch (e.g., Long instead of String in path variable)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Type mismatch: " + ex.getName() + " should be of type " + ex.getRequiredType().getSimpleName());
    }

    // Handle All Other Exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong: " + ex.getMessage());
    }

    // Handle Invalid Rule Exception
    @ExceptionHandler(InvalidRuleException.class)
    public ResponseEntity<ErrorResponse> handleInvalidRule(InvalidRuleException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid rule: " + ex.getMessage());
    }

    // Handle Payment Not Found Exception
    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePaymentNotFound(PaymentNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Payment not found: " + ex.getMessage());
    }

    // Handle Rule Not Found Exception
    @ExceptionHandler(RuleNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRuleNotFound(RuleNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Rule not found: " + ex.getMessage());
    }

    // Handle Rule Violation Exception
    @ExceptionHandler(RuleViolationException.class)
    public ResponseEntity<ErrorResponse> handleRuleViolation(RuleViolationException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Rule violation: " + ex.getMessage());
    }

    // Handle User Not Found Exception
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "User not found: " + ex.getMessage());
    }

    // Handle Wallet Not Found Exception
    @ExceptionHandler(WalletNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleWalletNotFound(WalletNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Wallet not found: " + ex.getMessage());
    }

    // Utility to build response
    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
        return new ResponseEntity<>(new ErrorResponse(message), status);
    }
}
