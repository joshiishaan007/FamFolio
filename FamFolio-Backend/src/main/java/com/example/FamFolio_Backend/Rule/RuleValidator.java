package com.example.FamFolio_Backend.Rule;

import com.example.FamFolio_Backend.Exception.InvalidRuleException;
import com.example.FamFolio_Backend.RuleAction.RuleActionDTO;
import com.example.FamFolio_Backend.RuleCondition.RuleConditionDTO;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

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

    private static final Set<String> VALID_DAYS = new HashSet<>(Arrays.asList(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"));

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
            case "CATEGORY":
                validateCategoryCondition(condition);
                break;
            case "DAY":
                validateDayCondition(condition);
                break;
            case "MERCHANT":
                validateMerchantCondition(condition);
                break;
            case "CUSTOM":
                validateCustomCondition(condition);
                break;
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

    private void validateCategoryCondition(RuleConditionDTO condition) {
        // For category conditions, validate based on operator type
        if ("IN".equals(condition.getOperator()) || "NOT_IN".equals(condition.getOperator())) {
            String[] categories = condition.getValueString().split(",");
            if (categories.length == 0) {
                throw new InvalidRuleException("Category list cannot be empty");
            }

            // Check that each category isn't empty
            for (String category : categories) {
                if (category.trim().isEmpty()) {
                    throw new InvalidRuleException("Category value cannot be empty");
                }
            }
        } else if ("=".equals(condition.getOperator())) {
            // For equals operator, just ensure the category isn't empty
            if (condition.getValueString().trim().isEmpty()) {
                throw new InvalidRuleException("Category value cannot be empty");
            }
        } else {
            throw new InvalidRuleException("Invalid operator for CATEGORY condition: " + condition.getOperator() +
                    ". Valid operators are '=', 'IN', 'NOT_IN'");
        }
    }

    private void validateDayCondition(RuleConditionDTO condition) {
        if ("IN".equals(condition.getOperator()) || "NOT_IN".equals(condition.getOperator())) {
            String[] days = condition.getValueString().split(",");
            if (days.length == 0) {
                throw new InvalidRuleException("Day list cannot be empty");
            }

            // Check each day is valid
            for (String day : days) {
                String trimmedDay = day.trim().toUpperCase();
                if (!VALID_DAYS.contains(trimmedDay)) {
                    throw new InvalidRuleException("Invalid day value: " + day +
                            ". Valid days are: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY");
                }
            }
        } else if ("=".equals(condition.getOperator())) {
            String day = condition.getValueString().trim().toUpperCase();
            if (!VALID_DAYS.contains(day)) {
                throw new InvalidRuleException("Invalid day value: " + day +
                        ". Valid days are: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY");
            }
        } else {
            throw new InvalidRuleException("Invalid operator for DAY condition: " + condition.getOperator() +
                    ". Valid operators are '=', 'IN', 'NOT_IN'");
        }
    }

    private void validateMerchantCondition(RuleConditionDTO condition) {
        String valueString = condition.getValueString().trim();

        // For operators that work with lists
        if ("IN".equals(condition.getOperator()) || "NOT_IN".equals(condition.getOperator())) {
            String[] merchants = valueString.split(",");
            if (merchants.length == 0) {
                throw new InvalidRuleException("Merchant list cannot be empty");
            }

            // Check that each merchant name isn't empty
            for (String merchant : merchants) {
                if (merchant.trim().isEmpty()) {
                    throw new InvalidRuleException("Merchant name cannot be empty");
                }
            }
        }
        // For string comparison operators
        else if ("=".equals(condition.getOperator()) ||
                "CONTAINS".equals(condition.getOperator()) ||
                "STARTS_WITH".equals(condition.getOperator()) ||
                "ENDS_WITH".equals(condition.getOperator())) {

            if (valueString.isEmpty()) {
                throw new InvalidRuleException("Merchant value cannot be empty");
            }
        } else {
            throw new InvalidRuleException("Invalid operator for MERCHANT condition: " + condition.getOperator() +
                    ". Valid operators are '=', 'IN', 'NOT_IN', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'");
        }
    }

    private void validateCustomCondition(RuleConditionDTO condition) {
        // For custom conditions, we'll allow all operators but ensure the value isn't empty
        String valueString = condition.getValueString().trim();

        if (valueString.isEmpty()) {
            throw new InvalidRuleException("Custom condition value cannot be empty");
        }

        // For BETWEEN operator, validate it has two values
        if ("BETWEEN".equals(condition.getOperator())) {
            String[] values = valueString.split(",");
            if (values.length != 2) {
                throw new InvalidRuleException("BETWEEN operator requires two comma-separated values");
            }

            if (values[0].trim().isEmpty() || values[1].trim().isEmpty()) {
                throw new InvalidRuleException("Custom condition values cannot be empty");
            }
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

                break;
            case "BLOCK":
                // No special config required for BLOCK action
                break;
            case "REQUIRE_APPROVAL":

                break;
            case "CUSTOM":
                if (!action.getActionConfig().has("customActionType")) {
                    throw new InvalidRuleException("CUSTOM action requires 'customActionType' in config");
                }
                break;
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
            case "MANUAL_APPROVAL":
                validateManualApprovalRule(request);
                break;
            case "CUSTOM":
                validateCustomRule(request);
                break;
        }
    }

    private void validateSpendingLimitRule(RuleCreateRequest request) {
        boolean hasAmountCondition = request.getConditions().stream()
                .anyMatch(c -> "AMOUNT".equals(c.getConditionType()));

        if (!hasAmountCondition) {
            throw new InvalidRuleException("SPENDING_LIMIT rule must have at least one AMOUNT condition");
        }

        boolean hasLimitAction = request.getActions().stream()
                .anyMatch(a -> "LIMIT_AMOUNT".equals(a.getActionType()) || "BLOCK".equals(a.getActionType()));

        if (!hasLimitAction) {
            throw new InvalidRuleException("SPENDING_LIMIT rule must have either a LIMIT_AMOUNT or BLOCK action");
        }
    }

    private void validateTimeRestrictionRule(RuleCreateRequest request) {
        boolean hasTimeCondition = request.getConditions().stream()
                .anyMatch(c -> "TIME".equals(c.getConditionType()) || "DAY".equals(c.getConditionType()) || "DATE".equals(c.getConditionType()));

        if (!hasTimeCondition) {
            throw new InvalidRuleException("TIME_RESTRICTION rule must have at least one TIME, DAY, or DATE condition");
        }
    }

    private void validateCategoryBlockRule(RuleCreateRequest request) {
        boolean hasCategoryCondition = request.getConditions().stream()
                .anyMatch(c -> "CATEGORY".equals(c.getConditionType()));

        if (!hasCategoryCondition) {
            throw new InvalidRuleException("CATEGORY_BLOCK rule must have at least one CATEGORY condition");
        }

        boolean hasBlockAction = request.getActions().stream()
                .anyMatch(a -> "BLOCK".equals(a.getActionType()));

        if (!hasBlockAction) {
            throw new InvalidRuleException("CATEGORY_BLOCK rule must have at least one BLOCK action");
        }
    }

    private void validateManualApprovalRule(RuleCreateRequest request) {
        boolean hasApprovalAction = request.getActions().stream()
                .anyMatch(a -> "REQUIRE_APPROVAL".equals(a.getActionType()));

        if (!hasApprovalAction) {
            throw new InvalidRuleException("MANUAL_APPROVAL rule must have at least one REQUIRE_APPROVAL action");
        }
    }

    private void validateCustomRule(RuleCreateRequest request) {
        // For custom rules, ensure there's at least one condition and one action
        if (request.getConditions().isEmpty()) {
            throw new InvalidRuleException("Rule must have at least one condition");
        }

        if (request.getActions().isEmpty()) {
            throw new InvalidRuleException("Rule must have at least one action");
        }
    }
}