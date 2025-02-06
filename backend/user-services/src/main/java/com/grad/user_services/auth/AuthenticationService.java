package com.grad.user_services.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grad.user_services.exceptions.AuthenticationException;
import com.grad.user_services.config.JwtService;
import com.grad.user_services.dao.AdminRepository;
import com.grad.user_services.dao.UserRepository;
import com.grad.user_services.model.BaseAccount;
import com.grad.user_services.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        logger.info("Registering user with email: {}", request.getEmail());
        
        String firstname = request.getFirstname();
        String lastname = request.getLastname();
        String email = request.getEmail();
        String password = passwordEncoder.encode(request.getPassword());

        // Create a new User instance
        User user = new User(firstname, lastname, email, password);  

        // Save the user
        var savedUser = userRepository.save(user);
        logger.info("User {} registered successfully", email);

        // Generate tokens with userId
        var jwtToken = jwtService.generateToken(savedUser, savedUser.getId());
        var refreshToken = jwtService.generateRefreshToken(savedUser, savedUser.getId());
        logger.info("Tokens generated for user: {}", email);

        return AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .build();
    }
public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Authenticate the user with the provided credentials
        authenticateUser(request);

        // Retrieve the account (either Admin or User)
        BaseAccount account = getAccount(request.getEmail());

        // Check if the user is approved (if a User)
        ensureUserIsApproved(account);

        // Generate and return tokens
        return generateTokens(account);
    }

    private void authenticateUser(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Invalid email or password.");
        }
    }

    private BaseAccount getAccount(String email) {
        return adminRepository.findByEmail(email)
            .map(admin -> (BaseAccount) admin)
            .orElseGet(() -> userRepository.findByEmail(email)
                .map(user -> (BaseAccount) user)
                .orElseThrow(() -> new AuthenticationException("User or Admin not found with email: " + email))
            );
    }

    private void ensureUserIsApproved(BaseAccount account) {
        if (account instanceof User) {
            User user = (User) account;
            if (!user.isApproved()) {
              throw new AuthenticationException("Your account is under review. Please wait for approval.");

            }
        }
    }

    private AuthenticationResponse generateTokens(BaseAccount account) {
        String jwtToken = jwtService.generateToken(account, account.getId());
        String refreshToken = jwtService.generateRefreshToken(account, account.getId());
        return new AuthenticationResponse(jwtToken, refreshToken);
    }
  

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.error("Invalid authorization header, missing Bearer token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            new ObjectMapper().writeValue(response.getOutputStream(), 
                new ErrorResponse("Invalid authorization header"));
            return;
        }

        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        
        logger.info("Refreshing token for user: {}", userEmail);

        if (userEmail != null) {
            // Find the account
            BaseAccount account = userRepository.findByEmail(userEmail)
                .map(user -> (BaseAccount) user)
                .orElseGet(() -> adminRepository.findByEmail(userEmail)
                    .map(admin -> (BaseAccount) admin)
                    .orElseThrow(() -> {
                        logger.error("User or Admin not found for refresh token: {}", userEmail);
                        return new RuntimeException("User or Admin not found");
                    }));

            if (jwtService.isTokenValid(refreshToken, account)) {
                // Generate new access token with userId
                var accessToken = jwtService.generateToken(account, account.getId());

                var authResponse = AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();

                logger.info("Successfully refreshed token for account with email: {}", userEmail);
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            } else {
                logger.error("Invalid refresh token for account with email: {}", userEmail);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                new ObjectMapper().writeValue(response.getOutputStream(), 
                    new ErrorResponse("Invalid refresh token"));
            }
        }
    }
}

@lombok.Data
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
class ErrorResponse {
    private String message;
}