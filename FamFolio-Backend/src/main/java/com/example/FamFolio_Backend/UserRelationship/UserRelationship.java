package com.example.FamFolio_Backend.UserRelationship
;

import java.time.ZonedDateTime;

import com.example.FamFolio_Backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_relationships")
public class UserRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private User member;
    
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
    
    // Default constructor
    public UserRelationship() {
    }
    
    // Constructor with fields
    public UserRelationship(User owner, User member) {
        this.owner = owner;
        this.member = member;
        this.createdAt = ZonedDateTime.now();
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
    
    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = ZonedDateTime.now();
    }
}
