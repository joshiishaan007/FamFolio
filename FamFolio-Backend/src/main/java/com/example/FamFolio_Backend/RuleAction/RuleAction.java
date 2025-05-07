package com.example.FamFolio_Backend.RuleAction;

import java.time.ZonedDateTime;
import java.util.Map;

import com.example.FamFolio_Backend.Rule.Rule;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import org.json.JSONObject;

@Entity
@Table(name = "rule_actions")
public class RuleAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;
    
    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "action_config", columnDefinition = "jsonb")
    private String actionConfig; // Stored as JSON string

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    // Helper method to get action config as JSONObject
    @Transient
    public JSONObject getActionConfigAsJson() {
        if (actionConfig == null || actionConfig.isEmpty()) {
            return new JSONObject();
        }
        return new JSONObject(actionConfig);
    }

    // Helper method to set action config from JSONObject
    public void setActionConfigFromJson(JSONObject jsonObject) {
        if (jsonObject != null) {
            this.actionConfig = jsonObject.toString();
        }
    }

    // Default constructor
    public RuleAction() {
    }
    
    // Constructor with fields
    public RuleAction(Rule rule, String actionType, String actionConfig) {
        this.rule = rule;
        this.actionType = actionType;
        this.actionConfig = actionConfig;
        this.createdAt = ZonedDateTime.now();
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

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionConfig() {
        return actionConfig;
    }

    public void setActionConfig(String actionConfig) {
        this.actionConfig = actionConfig;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
