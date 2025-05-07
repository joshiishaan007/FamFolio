package com.example.FamFolio_Backend.UserRelationship;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;

@Service
public class UserRelationshipService {

    private final UserRelationshipRepository userRelationshipRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserRelationshipService(UserRelationshipRepository userRelationshipRepository, UserRepository userRepository) {
        this.userRelationshipRepository = userRelationshipRepository;
        this.userRepository = userRepository;
    }

    
    
    public void createUserRelationship(String ownerUsername, String memberUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found with username: " + ownerUsername));
        
        User member = userRepository.findByUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Member user not found with username: " + memberUsername));
        
        // Check if relationship already exists
        if (userRelationshipRepository.existsByOwnerAndMember(owner, member)) {
            throw new IllegalArgumentException("Relationship already exists between these users");
        }
        
        UserRelationship relationship = new UserRelationship(owner, member);
        userRelationshipRepository.save(relationship);
    }

    /**
     * Get all relationships owned by a user
     * @param ownerUsername The username of the owner
     * @return List of relationships
     */
    public List<UserRelationship> getRelationshipsByOwner(String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found with username: " + ownerUsername));
        
        return userRelationshipRepository.findByOwner(owner);
    }

    /**
     * Get all relationships where user is a member
     * @param memberUsername The username of the member
     * @return List of relationships
     */
    public List<UserRelationship> getRelationshipsByMember(String memberUsername) {
        User member = userRepository.findByUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Member user not found with username: " + memberUsername));
        
        return userRelationshipRepository.findByMember(member);
    }

    /**
     * Get a specific relationship between owner and member
     * @param ownerUsername The username of the owner
     * @param memberUsername The username of the member
     * @return The relationship if found
     */
    public Optional<UserRelationship> getRelationship(String ownerUsername, String memberUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found with username: " + ownerUsername));
        
        User member = userRepository.findByUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Member user not found with username: " + memberUsername));
        
        return userRelationshipRepository.findByOwnerAndMember(owner, member);
    }

    /**
     * Delete a relationship
     * @param relationshipId The ID of the relationship to delete
     * @throws IllegalArgumentException if relationship not found
     */
    @Transactional
    public void deleteUserRelationship(Long relationshipId) {
        if (!userRelationshipRepository.existsById(relationshipId)) {
            throw new IllegalArgumentException("Relationship not found with id: " + relationshipId);
        }
        userRelationshipRepository.deleteById(relationshipId);
    }
}