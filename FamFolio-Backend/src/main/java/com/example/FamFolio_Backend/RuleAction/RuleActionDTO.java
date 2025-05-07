package com.example.FamFolio_Backend.RuleAction;

import org.json.JSONObject;

public class RuleActionDTO {

    private Long id;
    private String actionType;
    private JSONObject actionConfig;

    public RuleActionDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public JSONObject getActionConfig() {
        return actionConfig;
    }

    public void setActionConfig(JSONObject actionConfig) {
        this.actionConfig = actionConfig;
    }
}
