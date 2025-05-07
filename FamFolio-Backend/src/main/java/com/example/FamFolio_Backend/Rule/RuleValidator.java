package com.example.FamFolio_Backend.Rule;

import com.example.FamFolio_Backend.Exception.InvalidRuleException;
import com.example.FamFolio_Backend.RuleAction.RuleActionDTO;
import com.example.FamFolio_Backend.RuleCondition.RuleConditionDTO;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class RuleValidator {

    private static final Set<String> VALID_RULE_TYPES = new HashSet<>(Arrays.asList(
            "SPENDING_LIMIT", "TIME_RESTRICTION", "CATEGORY_BLOCK", "MANUAL_APPROVAL", "CUSTOM"));

    private static final Set<String> VALID_CONDITION_TYPES = new HashSet<>(Arrays.asList(
            "AMOUNT", "CATEGORY", "TIME", "DAY", "DATE", "MERCHANT", "CUSTOM"));

    private static final Set<String> VALID_OPERATORS = new HashSet<>(Arrays.asList(
            ">", "<", "=", ">=", "<=", "BETWEEN", "IN", "NOT_IN", "CONTAINS", "STARTS_WITH", "ENDS_WITH"));

    private static final Set<String> VALID_ACTION_TYPES = new HashSet<>(Arrays.asList(
            "BLOCK", "NOTIFY", "REQUIRE_APPROVAL", "LIMIT_AMOUNT", "CUSTOM"));

    public void validateRuleCreateRequest(RuleCreateRequest request) {
        // Validate rule type
        if (!VALID_RULE_TYPES.contains(request.getRuleType())) {
            throw new InvalidRuleException("Invalid rule type: " + request.getRuleType());
        }

        // Validate rule conditions
        for (RuleConditionDTO condition : request.getConditions()) {
            validateRuleCondition(condition);
        }

        // Validate rule actions
        for (RuleActionDTO action : request.getActions()) {
            validateRuleAction(action);
        }

        // Validate rule type specific constraints
        validateRuleTypeSpecificConstraints(request);
    }

    private void validateRuleCondition(RuleConditionDTO condition) {
        // Validate condition type
        if (!VALID_CONDITION_TYPES.contains(condition.getConditionType())) {
            throw new InvalidRuleException("Invalid condition type: " + condition.getConditionType());
        }

        // Validate operator
        if (!VALID_OPERATORS.contains(condition.getOperator())) {
            throw new InvalidRuleException("Invalid operator: " + condition.getOperator());
        }

        // Validate valueString based on condition type and operator
        validateConditionValue(condition);
    }

    private void validateConditionValue(RuleConditionDTO condition) {
        String valueString = condition.getValueString();

        if (valueString == null || valueString.trim().isEmpty()) {
            throw new InvalidRuleException("Condition value cannot be empty");
        }

        // Type-specific validations
        switch (condition.getConditionType()) {
            case "AMOUNT":
                validateAmountCondition(condition);
                break;
            case "TIME":
                validateTimeCondition(condition);
                break;
            case "DATE":
                validateDateCondition(condition);
                break;
            // Add more validations for other condition types as needed
        }
    }

    private void validateAmountCondition(RuleConditionDTO condition) {
        try {
            if ("BETWEEN".equals(condition.getOperator())) {
                String[] values = condition.getValueString().split(",");
                if (values.length != 2) {
                    throw new InvalidRuleException("BETWEEN operator requires two comma-separated values");
                }
                Double.parseDouble(values[0].trim());
                Double.parseDouble(values[1].trim());
            } else {
                Double.parseDouble(condition.getValueString());
            }
        } catch (NumberFormatException e) {
            throw new InvalidRuleException("Invalid amount value: " + condition.getValueString());
        }
    }

    private void validateTimeCondition(RuleConditionDTO condition) {
        // Validate time format (HH:mm or HH:mm:ss)
        String timeRegex = "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$";

        if ("BETWEEN".equals(condition.getOperator())) {
            String[] times = condition.getValueString().split(",");
            if (times.length != 2) {
                throw new InvalidRuleException("BETWEEN operator requires two comma-separated time values");
            }

            if (!times[0].trim().matches(timeRegex) || !times[1].trim().matches(timeRegex)) {
                throw new InvalidRuleException("Invalid time format. Use HH:mm or HH:mm:ss");
            }
        } else if (!condition.getValueString().matches(timeRegex)) {
            throw new InvalidRuleException("Invalid time format. Use HH:mm or HH:mm:ss");
        }
    }

    private void validateDateCondition(RuleConditionDTO condition) {
        // Validate date format (yyyy-MM-dd)
        String dateRegex = "^\\d{4}-\\d{2}-\\d{2}$";

        if ("BETWEEN".equals(condition.getOperator())) {
            String[] dates = condition.getValueString().split(",");
            if (dates.length != 2) {
                throw new InvalidRuleException("BETWEEN operator requires two comma-separated date values");
            }

            if (!dates[0].trim().matches(dateRegex) || !dates[1].trim().matches(dateRegex)) {
                throw new InvalidRuleException("Invalid date format. Use yyyy-MM-dd");
            }
        } else if (!condition.getValueString().matches(dateRegex)) {
            throw new InvalidRuleException("Invalid date format. Use yyyy-MM-dd");
        }
    }

    private void validateRuleAction(RuleActionDTO action) {
        // Validate action type
        if (!VALID_ACTION_TYPES.contains(action.getActionType())) {
            throw new InvalidRuleException("Invalid action type: " + action.getActionType());
        }

        // Validate action config based on action type
        validateActionConfig(action);
    }

    private void validateActionConfig(RuleActionDTO action) {
        if (action.getActionConfig() == null) {
            throw new InvalidRuleException("Action config cannot be null");
        }

        // Type-specific validations
        switch (action.getActionType()) {
            case "LIMIT_AMOUNT":
                if (!action.getActionConfig().has("maxAmount")) {
                    throw new InvalidRuleException("LIMIT_AMOUNT action requires 'maxAmount' in config");
                }
                try {
                    double maxAmount = action.getActionConfig().getDouble("maxAmount");
                    if (maxAmount <= 0) {
                        throw new InvalidRuleException("maxAmount must be positive");
                    }
                } catch (Exception e) {
                    throw new InvalidRuleException("Invalid maxAmount in action config");
                }
                break;
            case "NOTIFY":
                if (!action.getActionConfig().has("notifyUser")) {
                    throw new InvalidRuleException("NOTIFY action requires 'notifyUser' in config");
                }
                break;
            // Add more validations for other action types as needed
        }
    }

    private void validateRuleTypeSpecificConstraints(RuleCreateRequest request) {
        switch (request.getRuleType()) {
            case "SPENDING_LIMIT":
                validateSpendingLimitRule(request);
                break;
            case "TIME_RESTRICTION":
                validateTimeRestrictionRule(request);
                break;
            case "CATEGORY_BLOCK":
                validateCategoryBlockRule(request);
                break;
            // Add more validations for other rule types as needed
        }
    }

    private void validateSpendingLimitRule(RuleCreateRequest request) {
        boolean hasAmountCondition = request.getConditions().stream()
                .anyMatch(c -> "AMOUNT".equals(c.getConditionType()));

        if (!hasAmountCondition) {
            throw new InvalidRuleException("SPENDING_LIMIT rule must have at least one AMOUNT condition");
        }
    }

    private void validateTimeRestrictionRule(RuleCreateRequest request) {
        boolean hasTimeCondition = request.getConditions().stream()
                .anyMatch(c -> "TIME".equals(c.getConditionType()));

        if (!hasTimeCondition) {
            throw new InvalidRuleException("TIME_RESTRICTION rule must have at least one TIME condition");
        }
    }

    private void validateCategoryBlockRule(RuleCreateRequest request) {
        boolean hasCategoryCondition = request.getConditions().stream()
                .anyMatch(c -> "CATEGORY".equals(c.getConditionType()));

        if (!hasCategoryCondition) {
            throw new InvalidRuleException("CATEGORY_BLOCK rule must have at least one CATEGORY condition");
        }
    }
}
