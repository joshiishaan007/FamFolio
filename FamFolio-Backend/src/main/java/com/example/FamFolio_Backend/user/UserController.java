package com.example.FamFolio_Backend.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.FamFolio_Backend.Security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FamFolio_Backend.UserRelationship.UserRelationship;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipRepository;
import com.example.FamFolio_Backend.UserRelationship.UserRelationshipService;

@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    // Create a new user - explicitly set consumes to JSON
//    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<UserResponseDTO> createOwner(@RequestBody UserRequestDTO user) {
//        try {
//            UserResponseDTO createdUser = userService.createOwner(user);
//            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
//        } catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerOwner(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        try {
            User createdUser = userService.createOwner(userRequestDTO);
            String token = jwtUtil.generateToken(createdUser.getUsername(), createdUser.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userService.convertUserToUserResponseDTO(createdUser));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register/{ownerUsername}")
    public ResponseEntity<Map<String, Object>> registerMember(@Valid @RequestBody UserRequestDTO userRequestDTO,
                                                            @PathVariable String ownerUsername) {
        try {
            User createdUser = userService.createMember(ownerUsername,userRequestDTO);
            String token = jwtUtil.generateToken(createdUser.getUsername(), createdUser.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userService.convertUserToUserResponseDTO(createdUser));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginOwner(@RequestBody LoginRequestDTO loginRequest) {
        try {
            User authenticatedUser = userService.authenticateUser(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            String token = jwtUtil.generateToken(authenticatedUser.getUsername(), authenticatedUser.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userService.convertUserToUserResponseDTO(authenticatedUser));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Get all users
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Get user by ID
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);

    }

    // Get user by username
    @GetMapping(value = "/username/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {

        UserResponseDTO user =userService.getUserByUsername(username);

        return new ResponseEntity<>(user, HttpStatus.OK);

    }

    // Get user by email
    @GetMapping(value = "/email", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponseDTO> getUserByEmail(@RequestParam String email) {

        UserResponseDTO user =userService.getUserByEmail(email);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // Update user
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO userDetails) {
        try {
            UserResponseDTO updatedUser = userService.updateUser(id, userDetails);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}