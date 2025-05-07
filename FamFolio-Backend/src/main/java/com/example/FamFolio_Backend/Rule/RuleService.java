package com.example.FamFolio_Backend.Rule;

import java.util.List;

public interface RuleService {

    RuleDTO createRule(RuleCreateRequest request);


    List<RuleDTO> getRulesByOwnerId(Long ownerId);


    List<RuleDTO> getRulesForMember(Long ownerId, Long memberId);


    RuleDTO getRuleById(Long ruleId);


    RuleDTO updateRule(Long ruleId, RuleCreateRequest request);


    RuleDTO setRuleActive(Long ruleId, boolean active);


    void deleteRule(Long ruleId);
}
