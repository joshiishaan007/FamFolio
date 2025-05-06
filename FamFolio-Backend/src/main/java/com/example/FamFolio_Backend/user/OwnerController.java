package com.example.FamFolio_Backend.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class OwnerController {

//    @Autowired
//    private OwnerService ownerService;
//
//    /**
//     * Initiate the user registration process
//     * 
//     * @param userDTO User information for registration
//     * @return Response with status of registration initiation
//     */
//    @PostMapping("/register/initiate")
//    public ResponseEntity<ApiResponse<Map<String, String>>> initiateRegistration(@Valid @RequestBody OwnerDTO ownerDTO) {
//        String otp = ownerService.initiateRegistration(ownerDTO);
//        
//        // Don't return the actual OTP in production environment
//        // This is just for development/testing purposes
//        Map<String, String> responseData = new HashMap<>();
//        responseData.put("message", "OTP sent to registered email address");
//        responseData.put("otp", otp); // Remove this in production!
//        
//        ApiResponse<Map<String, String>> response = ApiResponse.success(
//            "Aadhaar verification successful. Please check your email for OTP.", 
//            responseData
//        );
//        
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    /**
//     * Complete registration with OTP verification
//     * 
//     * @param userDTO User information for registration
//     * @param otp OTP received via email
//     * @return Response with registered user details
//     */
//    @PostMapping("/register/complete")
//    public ResponseEntity<ApiResponse<Owner>> completeRegistration(
//            @Valid @RequestBody OwnerDTO ownerDTO,
//            @RequestParam String otp) {
//        
//    	Owner registeredUser = ownerService.completeRegistration(ownerDTO, otp);
//        
//        ApiResponse<Owner> response = ApiResponse.success(
//            "Registration successful.", 
//            registeredUser
//        );
//        
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//  }
}