package com.example.FamFolio_Backend.Rule;


import com.example.FamFolio_Backend.Exception.RuleNotFoundException;
import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.RuleAction.RuleAction;
import com.example.FamFolio_Backend.RuleAction.RuleActionDTO;
import com.example.FamFolio_Backend.RuleAction.RuleActionRepository;
import com.example.FamFolio_Backend.RuleCondition.RuleCondition;
import com.example.FamFolio_Backend.RuleCondition.RuleConditionDTO;
import com.example.FamFolio_Backend.RuleCondition.RuleConditionRepository;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RuleServiceImpl implements RuleService {

    private final RuleRepository ruleRepository;
    private final RuleConditionRepository ruleConditionRepository;
    private final RuleActionRepository ruleActionRepository;
    private final RuleValidator ruleValidator;
    private final UserRepository userRepository;

    // Add the remaining methods to the service implementation

    @Autowired
    public RuleServiceImpl(
            RuleRepository ruleRepository,
            RuleConditionRepository ruleConditionRepository,
            RuleActionRepository ruleActionRepository,
            RuleValidator ruleValidator,
            UserRepository userRepository) {
        this.ruleRepository = ruleRepository;
        this.ruleConditionRepository = ruleConditionRepository;
        this.ruleActionRepository = ruleActionRepository;
        this.ruleValidator = ruleValidator;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public RuleDTO createRule(RuleCreateRequest request) {

        if (request.getOwner() == null) {
            throw new IllegalArgumentException("Owner ID is required.");
        }

        if (request.getMember() == null) {
            throw new IllegalArgumentException("Member ID is required.");
        }
        // Validate the rule
        ruleValidator.validateRuleCreateRequest(request);

        User owner = userRepository.findByUsername(request.getOwner())
                .orElseThrow(()->new UserNotFoundException("Owner not found with username:"+request.getOwner()));

        User member = userRepository.findByUsername(request.getMember())
                .orElseThrow(()->new UserNotFoundException("Member not found with username:"+request.getOwner()));

        // Create rule entity
        Rule rule = new Rule();
        rule.setOwner(owner);
        rule.setMember(member);
        rule.setRuleName(request.getRuleName());
        rule.setRuleType(request.getRuleType());
        rule.setIsActive(true);

        // Save rule to get ID
        Rule savedRule = ruleRepository.save(rule);

        // Create conditions
        for (RuleConditionDTO conditionDTO : request.getConditions()) {
            RuleCondition condition = new RuleCondition();
            condition.setRule(savedRule);
            condition.setConditionType(conditionDTO.getConditionType());
            condition.setOperator(conditionDTO.getOperator());
            condition.setValueString(conditionDTO.getValueString());

            savedRule.addCondition(condition);
        }

        // Create actions
        for (RuleActionDTO actionDTO : request.getActions()) {
            RuleAction action = new RuleAction();
            action.setRule(savedRule);
            action.setActionType(actionDTO.getActionType());
            action.setActionConfigFromJson(actionDTO.getActionConfig());

            savedRule.addAction(action);
        }

        // Save again with relationships
        savedRule = ruleRepository.save(savedRule);

        // Convert to DTO and return
        return convertToDTO(savedRule);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RuleDTO> getRulesByOwnerId(Long ownerId) {

        List<Rule> rules = ruleRepository.findByOwnerIdAndIsActiveTrue(ownerId);
        return rules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RuleDTO> getRulesForMember(Long ownerId, Long memberId) {
        List<Rule> rules = ruleRepository.findActiveRulesForMember(ownerId, memberId);
        return rules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RuleDTO getRuleById(Long ruleId) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuleNotFoundException(ruleId));
        return convertToDTO(rule);
    }

    @Override
    public List<RuleDTO> getRulesForMember(String memberUsername) {
        List<Rule> rules = ruleRepository.findByMember_Username(memberUsername);
        return rules.stream().map(this::convertToDTO).toList();
    }

    @Override
    @Transactional
    public RuleDTO updateRule(Long ruleId, RuleCreateRequest request) {
        // Validate the rule
        ruleValidator.validateRuleCreateRequest(request);

        // Find existing rule
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuleNotFoundException(ruleId));

        if(!rule.getOwner().getUsername().equals(request.getOwner())){
            throw new IllegalArgumentException("Enter valid Owner Id");
        }

        if(!rule.getMember().getUsername().equals(request.getMember())){
            throw new IllegalArgumentException("Enter valid Member Id");
        }

        // Update basic fields
        rule.setRuleName(request.getRuleName());
        rule.setRuleType(request.getRuleType());

        // Clear existing conditions and actions
        rule.getConditions().clear();
        rule.getActions().clear();

        // Add new conditions
        for (RuleConditionDTO conditionDTO : request.getConditions()) {
            RuleCondition condition = new RuleCondition();
            condition.setConditionType(conditionDTO.getConditionType());
            condition.setOperator(conditionDTO.getOperator());
            condition.setValueString(conditionDTO.getValueString());

            rule.addCondition(condition);
        }

        // Add new actions
        for (RuleActionDTO actionDTO : request.getActions()) {
            RuleAction action = new RuleAction();
            action.setActionType(actionDTO.getActionType());
            action.setActionConfigFromJson(actionDTO.getActionConfig());

            rule.addAction(action);
        }

        // Save updated rule
        Rule updatedRule = ruleRepository.save(rule);

        // Convert to DTO and return
        return convertToDTO(updatedRule);
    }

    @Override
    @Transactional
    public RuleDTO setRuleActive(Long ruleId, boolean active) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuleNotFoundException(ruleId));

        rule.setIsActive(active);
        Rule updatedRule = ruleRepository.save(rule);

        return convertToDTO(updatedRule);
    }

    @Override
    public RuleDTO updateRuleStatus(Long ruleId) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(()->new RuleNotFoundException("Rule not found with Id:"+ruleId));

        rule.setIsActive(!rule.getIsActive());

        return convertToDTO(ruleRepository.save(rule));
    }

    @Override
    @Transactional
    public void deleteRule(Long ruleId) {
        if (!ruleRepository.existsById(ruleId)) {
            throw new RuleNotFoundException(ruleId);
        }

        ruleRepository.deleteById(ruleId);
    }

    /**
     * Convert Rule entity to RuleDTO
     *
     * @param rule The rule entity
     * @return The rule DTO
     */
    private RuleDTO convertToDTO(Rule rule) {

        RuleDTO dto = new RuleDTO();
        dto.setId(rule.getId());
        dto.setOwnerId(rule.getOwner().getId());
        dto.setMemberId(rule.getMember().getId());
        dto.setRuleName(rule.getRuleName());
        dto.setRuleType(rule.getRuleType());
        dto.setActive(rule.getIsActive());
        dto.setCreatedAt(rule.getCreatedAt());
        dto.setUpdatedAt(rule.getUpdatedAt());

        // Convert conditions
        Set<RuleConditionDTO> conditionDTOs = new HashSet<>();
        for (RuleCondition condition : rule.getConditions()) {
            RuleConditionDTO conditionDTO = new RuleConditionDTO();
            conditionDTO.setId(condition.getId());
            conditionDTO.setConditionType(condition.getConditionType());
            conditionDTO.setOperator(condition.getOperator());
            conditionDTO.setValueString(condition.getValueString());

            conditionDTOs.add(conditionDTO);
        }
        dto.setConditions(conditionDTOs);

        // Convert actions
        Set<RuleActionDTO> actionDTOs = new HashSet<>();
        for (RuleAction action : rule.getActions()) {
            RuleActionDTO actionDTO = new RuleActionDTO();
            actionDTO.setId(action.getId());
            actionDTO.setActionType(action.getActionType());
            actionDTO.setActionConfig(action.getActionConfigAsJson());

            actionDTOs.add(actionDTO);
        }
        dto.setActions(actionDTOs);

        return dto;
    }
}
