package com.example.FamFolio_Backend.RuleViolation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ruleViolations")
public class RuleViolationController {

    private final RuleViolationService ruleViolationService;

    @Autowired
    public RuleViolationController(RuleViolationService ruleViolationService) {
        this.ruleViolationService = ruleViolationService;
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<List<String>> getViolationNotes(@PathVariable Long transactionId){
        return ResponseEntity.ok(ruleViolationService.getViolationNotes(transactionId));
    }
}
