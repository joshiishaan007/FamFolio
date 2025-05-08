package com.example.FamFolio_Backend.Rule;

import com.example.FamFolio_Backend.RuleAction.RuleActionDTO;
import com.example.FamFolio_Backend.RuleCondition.RuleConditionDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class RuleCreateRequest {
    @NotNull(message = "Owner ID is required")
    private String owner;

    private String member; // Optional - null means applies to all members

    @NotBlank(message = "Rule name is required")
    private String ruleName;

    @NotBlank(message = "Rule type is required")
    private String ruleType;

    @NotEmpty(message = "At least one condition is required")
    private List<RuleConditionDTO> conditions;

    @NotEmpty(message = "At least one action is required")
    private List<RuleActionDTO> actions;

    public RuleCreateRequest() {
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getMember() {
        return member;
    }

    public void setMember(String member) {
        this.member = member;
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

    public List<RuleConditionDTO> getConditions() {
        return conditions;
    }

    public void setConditions(List<RuleConditionDTO> conditions) {
        this.conditions = conditions;
    }

    public List<RuleActionDTO> getActions() {
        return actions;
    }

    public void setActions(List<RuleActionDTO> actions) {
        this.actions = actions;
    }
}
