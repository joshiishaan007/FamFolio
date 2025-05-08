package com.example.FamFolio_Backend.Exception;

public class RuleViolationException extends RuntimeException{
    public RuleViolationException(String message) {
        super(message);
    }
}
