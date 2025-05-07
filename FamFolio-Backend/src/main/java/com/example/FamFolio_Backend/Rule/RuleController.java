package com.example.FamFolio_Backend.Rule;


import com.example.FamFolio_Backend.Exception.InvalidRuleException;
import com.example.FamFolio_Backend.Exception.RuleNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rules")
public class RuleController {

    private final RuleService ruleService;

    @Autowired
    public RuleController(RuleService ruleService) {
        this.ruleService = ruleService;
    }

    @PostMapping
    public ResponseEntity<?> createRule(@Valid @RequestBody RuleCreateRequest request, BindingResult result) {
        // Check for validation errors
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(getValidationErrors(result));
        }

        try {
            RuleDTO createdRule = ruleService.createRule(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRule);
        } catch (InvalidRuleException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<RuleDTO>> getRulesByOwnerId(@PathVariable Long ownerId) {
        List<RuleDTO> rules = ruleService.getRulesByOwnerId(ownerId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/owner/{ownerId}/member/{memberId}")
    public ResponseEntity<List<RuleDTO>> getRulesForMember(
            @PathVariable Long ownerId,
            @PathVariable Long memberId) {
        List<RuleDTO> rules = ruleService.getRulesForMember(ownerId, memberId);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/{ruleId}")
    public ResponseEntity<?> getRuleById(@PathVariable Long ruleId) {
        try {
            RuleDTO rule = ruleService.getRuleById(ruleId);
            return ResponseEntity.ok(rule);
        } catch (RuleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{ruleId}")
    public ResponseEntity<?> updateRule(
            @PathVariable Long ruleId,
            @Valid @RequestBody RuleCreateRequest request,
            BindingResult result) {
        // Check for validation errors
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(getValidationErrors(result));
        }

        try {
            RuleDTO updatedRule = ruleService.updateRule(ruleId, request);
            return ResponseEntity.ok(updatedRule);
        } catch (RuleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (InvalidRuleException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{ruleId}/active/{active}")
    public ResponseEntity<?> setRuleActive(
            @PathVariable Long ruleId,
            @PathVariable boolean active) {
        try {
            RuleDTO updatedRule = ruleService.setRuleActive(ruleId, active);
            return ResponseEntity.ok(updatedRule);
        } catch (RuleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{ruleId}")
    public ResponseEntity<?> deleteRule(@PathVariable Long ruleId) {
        try {
            ruleService.deleteRule(ruleId);
            return ResponseEntity.noContent().build();
        } catch (RuleNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, String> getValidationErrors(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : result.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}
