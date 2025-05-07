package com.example.FamFolio_Backend.UserRelationship;


import java.time.LocalDateTime;

/**
 * Data Transfer Object for UserRelationship entity
 */
public class UserRelationshipDTO {
    
    private Long id;
    private String ownerUsername;
    private String ownerName;
    private String memberUsername;
    private String memberName;
    private LocalDateTime createdAt;
    
    public UserRelationshipDTO() {
    }
    
    public UserRelationshipDTO(UserRelationship relationship) {
        this.id = relationship.getId();
        this.ownerUsername = relationship.getOwner().getUsername();
        this.ownerName = relationship.getOwner().getName();
        this.memberUsername = relationship.getMember().getUsername();
        this.memberName = relationship.getMember().getName();
        this.createdAt = relationship.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getMemberUsername() {
        return memberUsername;
    }

    public void setMemberUsername(String memberUsername) {
        this.memberUsername = memberUsername;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}