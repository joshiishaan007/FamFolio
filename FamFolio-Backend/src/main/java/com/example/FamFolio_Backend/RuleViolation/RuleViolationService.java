package com.example.FamFolio_Backend.RuleViolation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RuleViolationService {

    private final RuleViolationRepository ruleViolationRepository;

    @Autowired
    public RuleViolationService(RuleViolationRepository ruleViolationRepository) {
        this.ruleViolationRepository = ruleViolationRepository;
    }

    public List<String> getViolationNotes(Long transactionId){
        return ruleViolationRepository.findViolationNotesByTransaction_Id(transactionId);
    }
}
