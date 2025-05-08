package com.example.FamFolio_Backend.Rule;

import com.example.FamFolio_Backend.Category.Category;
import com.example.FamFolio_Backend.Payment.Payment;
import com.example.FamFolio_Backend.RuleAction.RuleAction;
import com.example.FamFolio_Backend.RuleCondition.RuleCondition;
import com.example.FamFolio_Backend.RuleViolation.RuleViolation;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class RuleEngine {

    private static final Logger logger = LoggerFactory.getLogger(RuleEngine.class);
    private final RuleRepository ruleRepository;

    @Autowired
    public RuleEngine(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public List<RuleViolation> evaluatePayment(Payment payment, Long ownerId, Long memberId) {
        List<RuleViolation> violations = new ArrayList<>();

        // Get all active rules for this member
        List<Rule> applicableRules = ruleRepository.findActiveRulesForMember(ownerId, memberId);

        logger.info("Evaluating {} rules for payment ID: {}, amount: {}, merchant: {}, category: {}",
                applicableRules.size(),
                payment.getId(),
                payment.getAmount(),
                payment.getMerchantName(),
                payment.getCategory() != null ? payment.getCategory().getName() : "none");

        for (Rule rule : applicableRules) {
            boolean conditionsMet = evaluateRuleConditions(rule, payment);

            logger.debug("Rule: {}, conditions met: {}", rule.getRuleName(), conditionsMet);

            if (conditionsMet) {
                // Check if rule action should block the transaction
                boolean shouldBlock = evaluateRuleActions(rule, payment);

                if (shouldBlock) {
                    RuleViolation violation = new RuleViolation();
                    violation.setRule(rule);
//                    violation.setPayment(payment);
                    violation.setCreatedAt(LocalDateTime.now());
                    violation.setViolationNotes("Payment violates rule: " + rule.getRuleName());

                    violations.add(violation);

                    logger.info("Rule violation detected - Rule: {}, Payment: {}",
                            rule.getRuleName(), payment.getId());
                }
            }
        }

        return violations;
    }

    private boolean evaluateRuleConditions(Rule rule, Payment payment) {
        // If there are no conditions, rule applies
        if (rule.getConditions() == null || rule.getConditions().isEmpty()) {
            return true;
        }

        // All conditions must be met for the rule to apply
        for (RuleCondition condition : rule.getConditions()) {
            if (!evaluateCondition(condition, payment)) {
                return false;
            }
        }

        return true;
    }

    private boolean evaluateCondition(RuleCondition condition, Payment payment) {
        switch (condition.getConditionType()) {
            case "AMOUNT":
                return evaluateAmountCondition(condition, payment.getAmount());
            case "CATEGORY":
                return evaluateCategoryCondition(condition, payment.getCategory());
            case "TIME":
                return evaluateTimeCondition(condition, LocalDateTime.now().toLocalTime());
            case "DAY":
                return evaluateDayCondition(condition, LocalDateTime.now().getDayOfWeek().name());
            case "DATE":
                return evaluateDateCondition(condition, LocalDateTime.now().toLocalDate().toString());
            case "MERCHANT":
                return evaluateMerchantCondition(condition, payment.getMerchantName());
            case "CUSTOM":
                // Custom conditions would require specific implementation
                return true;
            default:
                logger.warn("Unknown condition type: {}", condition.getConditionType());
                return false;
        }
    }

    private boolean evaluateAmountCondition(RuleCondition condition, BigDecimal amount) {
        if (amount == null) {
            logger.warn("Payment amount is null when evaluating amount condition");
            return false;
        }

        String operator = condition.getOperator();
        String valueString = condition.getValueString();

        try {
            switch (operator) {
                case ">":
                    return amount.compareTo(new BigDecimal(valueString)) > 0;
                case "<":
                    return amount.compareTo(new BigDecimal(valueString)) < 0;
                case "=":
                    return amount.compareTo(new BigDecimal(valueString)) == 0;
                case ">=":
                    return amount.compareTo(new BigDecimal(valueString)) >= 0;
                case "<=":
                    return amount.compareTo(new BigDecimal(valueString)) <= 0;
                case "BETWEEN":
                    String[] values = valueString.split(",");
                    BigDecimal lowerBound = new BigDecimal(values[0].trim());
                    BigDecimal upperBound = new BigDecimal(values[1].trim());
                    return amount.compareTo(lowerBound) >= 0 && amount.compareTo(upperBound) <= 0;
                default:
                    logger.warn("Unknown operator for amount condition: {}", operator);
                    return false;
            }
        } catch (Exception e) {
            logger.error("Error evaluating amount condition: {}", e.getMessage());
            return false;
        }
    }

    private boolean evaluateCategoryCondition(RuleCondition condition, Category category) {
        if (category == null) {
            logger.debug("Payment category is null for category condition");
            return false;
        }

        String operator = condition.getOperator();
        String valueString = condition.getValueString();

        try {
            switch (operator) {
                case "=":
                    return category.getName().equals(valueString);
                case "IN":
                    String[] categories = valueString.split(",");
                    for (String c : categories) {
                        if (category.getName().equals(c.trim())) {
                            return true;
                        }
                    }
                    return false;
                case "NOT_IN":
                    String[] excludedCategories = valueString.split(",");
                    for (String c : excludedCategories) {
                        if (category.getName().equals(c.trim())) {
                            return false;
                        }
                    }
                    return true;
                default:
                    logger.warn("Unknown operator for category condition: {}", operator);
                    return false;
            }
        } catch (Exception e) {
            logger.error("Error evaluating category condition: {}", e.getMessage());
            return false;
        }
    }

    private boolean evaluateTimeCondition(RuleCondition condition, LocalTime currentTime) {
        String operator = condition.getOperator();
        String valueString = condition.getValueString();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        try {
            switch (operator) {
                case ">":
                    LocalTime afterTime = LocalTime.parse(valueString, timeFormatter);
                    return currentTime.isAfter(afterTime);
                case "<":
                    LocalTime beforeTime = LocalTime.parse(valueString, timeFormatter);
                    return currentTime.isBefore(beforeTime);
                case "BETWEEN":
                    String[] times = valueString.split(",");
                    LocalTime startTime = LocalTime.parse(times[0].trim(), timeFormatter);
                    LocalTime endTime = LocalTime.parse(times[1].trim(), timeFormatter);

                    // Special handling for time ranges that span midnight
                    if (startTime.isAfter(endTime)) {
                        return currentTime.isAfter(startTime) || currentTime.isBefore(endTime);
                    } else {
                        return !currentTime.isBefore(startTime) && !currentTime.isAfter(endTime);
                    }
                default:
                    logger.warn("Unknown operator for time condition: {}", operator);
                    return false;
            }
        } catch (Exception e) {
            logger.error("Error evaluating time condition: {}", e.getMessage());
            return false;
        }
    }

    private boolean evaluateDayCondition(RuleCondition condition, String currentDay) {
        String operator = condition.getOperator();
        String valueString = condition.getValueString();

        try {
            switch (operator) {
                case "=":
                    return currentDay.equalsIgnoreCase(valueString);
                case "IN":
                    String[] days = valueString.split(",");
                    for (String day : days) {
                        if (currentDay.equalsIgnoreCase(day.trim())) {
                            return true;
                        }
                    }
                    return false;
                case "NOT_IN":
                    String[] excludedDays = valueString.split(",");
                    for (String day : excludedDays) {
                        if (currentDay.equalsIgnoreCase(day.trim())) {
                            return false;
                        }
                    }
                    return true;
                default:
                    logger.warn("Unknown operator for day condition: {}", operator);
                    return false;
            }
        } catch (Exception e) {
            logger.error("Error evaluating day condition: {}", e.getMessage());
            return false;
        }
    }

    private boolean evaluateDateCondition(RuleCondition condition, String currentDate) {
        String operator = condition.getOperator();
        String valueString = condition.getValueString();

        try {
            switch (operator) {
                case "=":
                    return currentDate.equals(valueString);
                case ">":
                    return currentDate.compareTo(valueString) > 0;
                case "<":
                    return currentDate.compareTo(valueString) < 0;
                case ">=":
                    return currentDate.compareTo(valueString) >= 0;
                case "<=":
                    return currentDate.compareTo(valueString) <= 0;
                case "BETWEEN":
                    String[] dates = valueString.split(",");
                    String startDate = dates[0].trim();
                    String endDate = dates[1].trim();
                    return currentDate.compareTo(startDate) >= 0 && currentDate.compareTo(endDate) <= 0;
                default:
                    logger.warn("Unknown operator for date condition: {}", operator);
                    return false;
            }
        } catch (Exception e) {
            logger.error("Error evaluating date condition: {}", e.getMessage());
            return false;
        }
    }

    private boolean evaluateMerchantCondition(RuleCondition condition, String merchantName) {
        if (merchantName == null) {
            logger.debug("Merchant name is null for merchant condition");
            return false;
        }

        String operator = condition.getOperator();
        String valueString = condition.getValueString();

        try {
            switch (operator) {
                case "=":
                    return merchantName.equalsIgnoreCase(valueString);
                case "CONTAINS":
                    return merchantName.toLowerCase().contains(valueString.toLowerCase());
                case "STARTS_WITH":
                    return merchantName.toLowerCase().startsWith(valueString.toLowerCase());
                case "ENDS_WITH":
                    return merchantName.toLowerCase().endsWith(valueString.toLowerCase());
                case "IN":
                    String[] merchants = valueString.split(",");
                    for (String merchant : merchants) {
                        if (merchantName.equalsIgnoreCase(merchant.trim())) {
                            return true;
                        }
                    }
                    return false;
                case "NOT_IN":
                    String[] excludedMerchants = valueString.split(",");
                    for (String merchant : excludedMerchants) {
                        if (merchantName.equalsIgnoreCase(merchant.trim())) {
                            return false;
                        }
                    }
                    return true;
                default:
                    logger.warn("Unknown operator for merchant condition: {}", operator);
                    return false;
            }
        } catch (Exception e) {
            logger.error("Error evaluating merchant condition: {}", e.getMessage());
            return false;
        }
    }

    private boolean evaluateRuleActions(Rule rule, Payment payment) {
        if (rule.getActions() == null || rule.getActions().isEmpty()) {
            logger.warn("Rule {} has no actions defined", rule.getRuleName());
            return false;
        }

        for (RuleAction action : rule.getActions()) {
            logger.debug("Evaluating action: {} for rule: {}", action.getActionType(), rule.getRuleName());

            switch (action.getActionType()) {
                case "BLOCK":
                    return true; // Block the transaction
                case "LIMIT_AMOUNT":
                    try {
                        JSONObject config = action.getActionConfigAsJson();
                        if (config != null && config.has("maxAmount")) {
                            BigDecimal maxAmount = new BigDecimal(config.getString("maxAmount"));
                            if (payment.getAmount().compareTo(maxAmount) > 0) {
                                return true; // Block if amount exceeds limit
                            }
                        } else {
                            logger.warn("LIMIT_AMOUNT action missing proper configuration");
                        }
                    } catch (Exception e) {
                        logger.error("Error processing LIMIT_AMOUNT action: {}", e.getMessage());
                    }
                    break;
                case "REQUIRE_APPROVAL":
                    // For require approval, we would typically block the transaction
                    // and create an approval request
                    return true;
                case "NOTIFY":
                    // Notification doesn't block, just notifies
                    break;
                case "CUSTOM":
                    // Custom actions would need specific implementation
                    break;
                default:
                    logger.warn("Unknown action type: {}", action.getActionType());
                    break;
            }
        }

        return false; // Don't block by default
    }
}