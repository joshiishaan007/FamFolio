package com.example.FamFolio_Backend.Rule;

import com.example.FamFolio_Backend.RuleAction.RuleActionDTO;
import com.example.FamFolio_Backend.RuleCondition.RuleConditionDTO;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class RuleDTO {

    private Long id;
    private Long ownerId;
    private Long memberId; // Can be null if applies to all members
    private String ruleName;
    private String ruleType;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<RuleConditionDTO> conditions = new HashSet<>();
    private Set<RuleActionDTO> actions = new HashSet<>();

    public RuleDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getRuleType() {
        return ruleType;
    }

    public void setRuleType(String ruleType) {
        this.ruleType = ruleType;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    public Set<RuleConditionDTO> getConditions() {
        return conditions;
    }

    public void setConditions(Set<RuleConditionDTO> conditions) {
        this.conditions = conditions;
    }

    public Set<RuleActionDTO> getActions() {
        return actions;
    }

    public void setActions(Set<RuleActionDTO> actions) {
        this.actions = actions;
    }
}
