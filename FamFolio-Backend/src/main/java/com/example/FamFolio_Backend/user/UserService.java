package com.example.FamFolio_Backend.user;


import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipService;
import com.example.FamFolio_Backend.Wallet.WalletService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserRelationshipService userRelationshipService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final WalletService walletService;

    @Autowired
    public UserService(UserRepository userRepository,
                       UserRelationshipService userRelationshipService,
                       BCryptPasswordEncoder passwordEncoder,WalletService walletService) {
        this.userRepository = userRepository;
        this.userRelationshipService = userRelationshipService;
        this.passwordEncoder = passwordEncoder;
        this.walletService=walletService;
    }

    // Create a new user
    public User createOwner(UserRequestDTO userRequestDTO) {
        // Basic validation
        if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByPhoneNumber(userRequestDTO.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        if (userRepository.existsByAadharNumber(userRequestDTO.getAadharNumber())) {
            throw new IllegalArgumentException("Aadhar number already exists");
        }

        User user = new User();
        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setAadharNumber(userRequestDTO.getAadharNumber());
        user.setDateOfBirth(userRequestDTO.getDateOfBirth());
        user.setUsername(userRequestDTO.getUsername());
        user.setPhoneNumber(userRequestDTO.getPhoneNumber());
        user.setRole("OWNER");
        user.setStatus(true);
        user.setLastLogin(LocalDateTime.now());
        
        

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());
        user.setPasswordHash(hashedPassword);

        user = userRepository.save(user);
        walletService.createWallet(user);	
        
        return user;
    }

    // Get all users
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream().map(this::convertUserToUserResponseDTO).toList();
    }

    // Get user by ID
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()->new UserNotFoundException("User not found with Id:"+id));

        return convertUserToUserResponseDTO(user);
    }

    // Get user by username
    public UserResponseDTO getUserByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(()->new UserNotFoundException("User not found with username:"+username));

        return convertUserToUserResponseDTO(user);
    }

    public User createMember(String ownerUsername, UserRequestDTO dto){

        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(()->new UserNotFoundException("Owner not found with username:"+ownerUsername));

        // Check if username already exists
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email already exists
        if (dto.getEmail() != null && userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Check if Aadhar already exists
        if (dto.getAadharNumber() != null && userRepository.existsByAadharNumber(dto.getAadharNumber())) {
            throw new IllegalArgumentException("AadharNumber already exists");
        }

        if (userRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setAadharNumber(dto.getAadharNumber());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setUsername(dto.getUsername());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole("MEMBER");
        user.setStatus(true);
        user.setLastLogin(LocalDateTime.now());

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPasswordHash(hashedPassword);

        user = userRepository.save(user);
        walletService.createWallet(user);	
        userRelationshipService.createUserRelationship(ownerUsername,user.getUsername());

        return user;
    }

    @Transactional
    public User authenticateUser(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username"));

        if (!verifyPassword(user, password)) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getStatus()) {
            throw new RuntimeException("Account is disabled");
        }

        // Update last login time
        user.setLastLogin(LocalDateTime.now());
        return userRepository.save(user);
    }

    public boolean verifyPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    public UserResponseDTO convertUserToUserResponseDTO (User user){
        UserResponseDTO dto = new UserResponseDTO();

        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setUsername(user.getUsername());
        dto.setDateOfBirth(user.getDateOfBirth());

        return dto;
    }


    // Get user by email
    public UserResponseDTO getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new UserNotFoundException("User not found with email:"+email));

        return convertUserToUserResponseDTO(user);
    }

    // Update user
    public UserResponseDTO updateUser(Long id, UserRequestDTO userDetails) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(()->new UserNotFoundException("User not found with Id:"+id));
            
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
            if(userDetails.getName() != null){
                existingUser.setName(userDetails.getName());
            }
            if(userDetails.getUsername() != null){
                existingUser.setUsername(userDetails.getUsername());
            }
            if(userDetails.getEmail() != null){
                existingUser.setEmail(userDetails.getEmail());;
            }



            // Only update password if provided
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                existingUser.setPasswordHash(userDetails.getPassword());
            }
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());
            existingUser.setAadharNumber(userDetails.getAadharNumber());
            existingUser.setDateOfBirth(userDetails.getDateOfBirth());

            return convertUserToUserResponseDTO(userRepository.save(existingUser));
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(()->new UserNotFoundException("User not found with username:"+username));
    }
}