package com.example.FamFolio_Backend.Security;

import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import com.example.FamFolio_Backend.user.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private SecretKey key;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        logger.info("JWT key initialized");
    }

    public String generateToken(String username, Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration * 1000);

        User user = userRepository.findById(userId)
                .orElseThrow(()->new UserNotFoundException("User not found with Id:"+userId));

        Map<String,Object> claims = new HashMap<String,Object>();
        claims.put("userId",userId);
        claims.put("userRole",user.getRole());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            logger.error("Error extracting username: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            logger.error("Invalid token: {}", e.getMessage());
            return false;
        }
    }
}
