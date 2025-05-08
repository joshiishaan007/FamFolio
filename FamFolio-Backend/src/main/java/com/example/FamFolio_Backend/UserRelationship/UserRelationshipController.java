package com.example.FamFolio_Backend.UserRelationship;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.example.FamFolio_Backend.user.User;

import com.example.FamFolio_Backend.Wallet.Wallet;
import com.example.FamFolio_Backend.user.UserResponseDTO;
import com.example.FamFolio_Backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/relationships")
public class UserRelationshipController {

    private final UserRelationshipService userRelationshipService;
    private final UserService userService;

    @Autowired
    public UserRelationshipController(UserRelationshipService userRelationshipService, UserService userService) {
        this.userRelationshipService = userRelationshipService;
        this.userService = userService;
    }

    @GetMapping("/family/{username}")
    @PreAuthorize("hasRole('OWNER')")
    public List<String> getAllFamilyMembers(@PathVariable String username){
        return userRelationshipService.getFamilyMembers(username);
    }

    
    
    
    /**
     * Create a new user relationship
     * @param ownerUsername Username of the owner
     * @param memberUsername Username of the member
     * @return The created relationship
     */
//    @PostMapping
//    public ResponseEntity<?> createUserRelationship(
//            @RequestParam String ownerUsername,
//            @RequestParam String memberUsername) {
//        try {
//            UserRelationship relationship = userRelationshipService.createUserRelationship(ownerUsername, memberUsername);
//            return new ResponseEntity<>(new UserRelationshipDTO(relationship), HttpStatus.CREATED);
//        } catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }

    /**
     * Get all relationships owned by a user
     * @param username The username of the owner
     * @return List of relationships
     */
    @GetMapping("owner/{username}")
    public ResponseEntity<?> getRelationshipsByOwner(@PathVariable String username) {
        try {
            List<UserRelationship> relationships = userRelationshipService.getRelationshipsByOwner(username);
            List<UserRelationshipDTO> dtos = relationships.stream()
                    .map(UserRelationshipDTO::new)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/memberwallets/{ownerusername}") //for getting all wallets
    public List<Wallet> getWalletByOwnerUsername(@PathVariable String ownerusername) {

      List<UserRelationship> users=userRelationshipService.getRelationshipsByOwner(ownerusername);
       List<User> userList= users.stream().map(uu->userService.findByUsername(uu.getMember().getUsername()))
               .collect(Collectors.toList());

       List<Wallet> wallets=userList.stream().map(ul->ul.getWallets())
               .collect(Collectors.toList());

       return wallets;


    }

    /**
     * Get all relationships where user is a member
     * @param username The username of the member
     * @return List of relationships
     */
    @GetMapping("/member/{username}")
    public ResponseEntity<?> getRelationshipsByMember(@PathVariable String username) {
        try {
            List<UserRelationship> relationships = userRelationshipService.getRelationshipsByMember(username);
            List<UserRelationshipDTO> dtos = relationships.stream()
                    .map(UserRelationshipDTO::new)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get a specific relationship between owner and member
     * @param ownerUsername The username of the owner
     * @param memberUsername The username of the member
     * @return The relationship if found
     */
    @GetMapping
    public ResponseEntity<?> getRelationship(
            @RequestParam String ownerUsername,
            @RequestParam String memberUsername) {
        try {
            Optional<UserRelationship> relationship = userRelationshipService.getRelationship(ownerUsername, memberUsername);
            if (relationship.isPresent()) {
                return new ResponseEntity<>(new UserRelationshipDTO(relationship.get()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Relationship not found", HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Delete a relationship
     * @param id The ID of the relationship to delete
     * @return Success message or error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserRelationship(@PathVariable Long id) {
        try {
            userRelationshipService.deleteUserRelationship(id);
            return new ResponseEntity<>("Relationship deleted successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}