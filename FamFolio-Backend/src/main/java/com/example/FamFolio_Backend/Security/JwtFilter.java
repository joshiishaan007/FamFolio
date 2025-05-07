package com.example.FamFolio_Backend.Security;

import com.example.FamFolio_Backend.Exception.UserNotFoundException;
import com.example.FamFolio_Backend.user.User;
import com.example.FamFolio_Backend.user.UserRepository;
import com.example.FamFolio_Backend.user.UserResponseDTO;
import com.example.FamFolio_Backend.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            username = jwtUtil.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                try {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(()->new UserNotFoundException("User not found"));


                        User newUser = new User();
                        newUser.setId(user.getId());
                        newUser.setUsername(user.getUsername());
                        newUser.setRole(user.getRole());

                        // Set both the request attribute and the Security context
                        request.setAttribute("user", newUser);

                        // Create authentication object with authorities
                        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                                new SimpleGrantedAuthority("ROLE_" + newUser.getRole())
                        );

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(username, null, authorities);

                        SecurityContextHolder.getContext().setAuthentication(authentication);


                } catch (Exception e) {
                    logger.error("Error during authentication process", e);
                }
            } else {
                logger.warn("Token validation failed");
            }
        }

        filterChain.doFilter(request, response);
    }
}

