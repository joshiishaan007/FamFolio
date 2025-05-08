package com.example.FamFolio_Backend.Wallet;

import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import com.example.FamFolio_Backend.user.UserResponseDTO;
import com.example.FamFolio_Backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    @Autowired
    public WalletController(WalletService walletService, UserRepository userRepository) {
        this.walletService = walletService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<Wallet> createWallet(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new UserNotFoundException("User not found with Id:"+userId));
        Wallet wallet = walletService.createWallet(user);
        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getWalletByUserId(@PathVariable Long userId) {

        Wallet wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }


    @GetMapping("/user/username/{username}")
    public ResponseEntity<Wallet> getWalletByUserName(@PathVariable String username) {
        User user = userRepository.findByUsername(username).get();
        Wallet wallet = walletService.getWalletByUserId(user.getId());
        return ResponseEntity.ok(wallet);
    }


    @PutMapping("/update-balance/{username}")
    public ResponseEntity<Wallet> updateWalletBalance(
            @PathVariable String username,
            @RequestBody WalletDTO walletDTO) {

        int userId=userRepository.findByUsername(username).get().getId().intValue();
        Wallet wallet = walletService.updateWalletBalance(userId, walletDTO);

        return ResponseEntity.ok(wallet);
    }
}