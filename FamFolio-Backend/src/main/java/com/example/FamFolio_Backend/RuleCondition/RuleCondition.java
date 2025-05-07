package com.example.FamFolio_Backend.RuleCondition;

import java.time.LocalDateTime;

import com.example.FamFolio_Backend.Rule.Rule;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "rule_conditions")
public class RuleCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;
    
    @Column(name = "condition_type", nullable = false, length = 50) // 'AMOUNT', 'CATEGORY', 'TIME', 'DAY', 'DATE', 'MERCHANT', 'CUSTOM'
    private String conditionType;
    
    @Column(name = "operator", nullable = false, length = 20)
    private String operator;
    
    @Column(name = "value_string")
    private String valueString;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Default constructor
    public RuleCondition() {
    }
    
    // Constructor with fields
    public RuleCondition(Rule rule, String conditionType, String operator, String valueString) {
        this.rule = rule;
        this.conditionType = conditionType;
        this.operator = operator;
        this.valueString = valueString;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rule getRule() {
        return rule;
    }

    public void setRule(Rule rule) {
        this.rule = rule;
    }

    public String getConditionType() {
        return conditionType;
    }

    public void setConditionType(String conditionType) {
        this.conditionType = conditionType;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getValueString() {
        return valueString;
    }

    public void setValueString(String valueString) {
        this.valueString = valueString;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}