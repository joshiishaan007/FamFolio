package com.example.FamFolio_Backend.Rule;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.FamFolio_Backend.RuleAction.RuleAction;
import com.example.FamFolio_Backend.RuleCondition.RuleCondition;
import com.example.FamFolio_Backend.RuleViolation.RuleViolation;
import com.example.FamFolio_Backend.user.User;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "rules")
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;
    
    @Column(name = "rule_name", nullable = false, length = 100)
    private String ruleName;
    
    @Column(name = "rule_type", nullable = false, length = 50)
    private String ruleType;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;
    
    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RuleCondition> conditions = new HashSet<>();
    
    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RuleAction> actions = new HashSet<>();

    public void addCondition(RuleCondition condition) {
        conditions.add(condition);
        condition.setRule(this);
    }

    public void removeCondition(RuleCondition condition) {
        conditions.remove(condition);
        condition.setRule(null);
    }

    public void addAction(RuleAction action) {
        actions.add(action);
        action.setRule(this);
    }

    public void removeAction(RuleAction action) {
        actions.remove(action);
        action.setRule(null);
    }

    // Default constructor
    public Rule() {
        this.isActive = true;
    }
    
    // Constructor with fields
    public Rule(User owner, User member, String ruleName, String ruleType) {
        this.owner = owner;
        this.member = member;
        this.ruleName = ruleName;
        this.ruleType = ruleType;
        this.isActive = true;
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = ZonedDateTime.now();
    }


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getMember() {
        return member;
    }

    public void setMember(User member) {
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<RuleCondition> getConditions() {
        return conditions;
    }

    public void setConditions(Set<RuleCondition> conditions) {
        this.conditions = conditions;
    }

    public Set<RuleAction> getActions() {
        return actions;
    }

    public void setActions(Set<RuleAction> actions) {
        this.actions = actions;
    }
}
