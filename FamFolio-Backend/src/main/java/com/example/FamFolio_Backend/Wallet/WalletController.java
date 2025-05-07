package com.example.FamFolio_Backend.Wallet;

import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;
    private final UserService userService;

    @Autowired
    public WalletController(WalletService walletService, UserService userService) {
        this.walletService = walletService;
        this.userService = userService;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<Wallet> createWallet(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletService.createWallet(user);
        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getWalletByUserId(@PathVariable Long userId) {
        Wallet wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }

    @PutMapping("/update-balance/{userId}")
    public ResponseEntity<Wallet> updateWalletBalance(
            @PathVariable int userId,
            @RequestBody WalletDTO walletDTO) {
        Wallet wallet = walletService.updateWalletBalance(userId, walletDTO);

        return ResponseEntity.ok(wallet);
    }
}