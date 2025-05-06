package com.example.FamFolio_Backend.user;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create a new user
    public User createUser(User user) {
        // Basic validation
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        if (userRepository.existsByAadharNumber(user.getAadharNumber())) {
            throw new IllegalArgumentException("Aadhar number already exists");
        }
        
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Get user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Update user
    public User updateUser(Long id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            
            // Check if username is being changed and if it already exists
            if (!existingUser.getUsername().equals(userDetails.getUsername()) && 
                userRepository.existsByUsername(userDetails.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            
            // Check if email is being changed and if it already exists
            if (!existingUser.getEmail().equals(userDetails.getEmail()) && 
                userRepository.existsByEmail(userDetails.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            
            // Check if phone number is being changed and if it already exists
            if (!existingUser.getPhoneNumber().equals(userDetails.getPhoneNumber()) && 
                userRepository.existsByPhoneNumber(userDetails.getPhoneNumber())) {
                throw new IllegalArgumentException("Phone number already exists");
            }
            
            // Check if aadhar number is being changed and if it already exists
            if (!existingUser.getAadharNumber().equals(userDetails.getAadharNumber()) && 
                userRepository.existsByAadharNumber(userDetails.getAadharNumber())) {
                throw new IllegalArgumentException("Aadhar number already exists");
            }

            // Update the fields
            existingUser.setName(userDetails.getName());
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            // Only update password if provided
            if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isEmpty()) {
                existingUser.setPasswordHash(userDetails.getPasswordHash());
            }
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());
            existingUser.setAadharNumber(userDetails.getAadharNumber());
            existingUser.setDateOfBirth(userDetails.getDateOfBirth());
            existingUser.setRole(userDetails.getRole());

            return userRepository.save(existingUser);
        } else {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}