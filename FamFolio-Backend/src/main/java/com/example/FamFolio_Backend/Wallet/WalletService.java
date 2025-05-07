package com.example.FamFolio_Backend.Wallet;

import com.example.FamFolio_Backend.externalMockBank.BankService;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;

@Service
@Transactional
public class WalletService {

    @Autowired
    private BankService bankService;

    private final WalletRepository walletRepository;
    private final UserService userService;
    private static final String UPI_SUFFIX = "@famfolio";
    private static final String ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int UPI_RANDOM_PART_LENGTH = 6;

    @Autowired
    public WalletService(WalletRepository walletRepository, UserService userService) {
        this.walletRepository = walletRepository;
        this.userService = userService;
    }

    public Wallet createWallet(User user) {
        String upiId = generateUniqueUpiId();
        Wallet wallet = new Wallet(user, upiId);
        return walletRepository.save(wallet);
    }

    public Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId);
    }

    private String generateUniqueUpiId() {
        Random random = new Random();
        String upiId;

        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < UPI_RANDOM_PART_LENGTH; i++) {
                int randomIndex = random.nextInt(ALLOWED_CHARS.length());
                sb.append(ALLOWED_CHARS.charAt(randomIndex));
            }
            upiId = sb.toString() + UPI_SUFFIX;
        } while (walletRepository.existsByUpiId(upiId));

        return upiId;
    }
    public Wallet updateWalletBalance(int userId, WalletDTO walletDTO) {
        User user = userService.getUserById((long) userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet == null) {
            throw new RuntimeException("Wallet not found");
        }

        boolean isValid;
        if (walletDTO.getType().equals("card")) {
            isValid = bankService.isValidCardAndBalanceAvailable(
                    walletDTO.getVerificationid(),
                    walletDTO.getAmount()
            );
        } else {
            isValid = bankService.isValidUpiAndBalanceAvailable(
                    walletDTO.getVerificationid(),
                    walletDTO.getPin(),
                    walletDTO.getAmount()
            );
        }

        if (!isValid) {
            throw new RuntimeException(
                    walletDTO.getType() + " verification failed or insufficient balance"
            );
        }

        // Handle increment/decrement logic
        BigDecimal newBalance;
        if ("increment".equalsIgnoreCase(walletDTO.getUpdatetype())) {
            newBalance = wallet.getBalance().add(walletDTO.getAmount());
        } else if ("decrement".equalsIgnoreCase(walletDTO.getUpdatetype())) {
            newBalance = wallet.getBalance().subtract(walletDTO.getAmount());
            // Check for negative balance
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Insufficient balance for this operation");
            }
        } else {
            throw new RuntimeException("Invalid update type. Must be 'increment' or 'decrement'");
        }

        wallet.setBalance(newBalance);
        return walletRepository.save(wallet);
    }
}