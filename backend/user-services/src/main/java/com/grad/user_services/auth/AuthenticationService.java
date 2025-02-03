package com.grad.user_services.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

  // Register user
  public AuthenticationResponse register(RegisterRequest request) {
    logger.info("Registering user with email: {}", request.getEmail());
    
    String firstname = request.getFirstname();
    String lastname = request.getLastname();
    String email = request.getEmail();
    String password = passwordEncoder.encode(request.getPassword());

    // Create a new User instance with the provided details
    User user = new User(firstname, lastname, email, password);  

    // Save the user to the repository
    var savedUser = userRepository.save(user);
    logger.info("User {} registered successfully", email);

    // Generate the JWT and refresh tokens
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    logger.info("Tokens generated for user: {}", email);

    // Return the tokens
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  // Authenticate user or admin
  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    logger.info("Authenticating user or admin with email: {}", request.getEmail());

    // Authenticate the provided credentials
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );

    // Log to check if email is being passed correctly
    logger.info("Searching for user or admin with email: {}", request.getEmail());

    // Attempt to fetch admin first
    BaseAccount account = adminRepository.findByEmail(request.getEmail())
            .map(admin -> (BaseAccount) admin) // If admin found
            .orElseGet(() -> {
                logger.info("Admin not found, checking user repository");
                return userRepository.findByEmail(request.getEmail())
                        .map(user -> (BaseAccount) user) // If user found
                        .orElseThrow(() -> {
                            logger.error("User not found for email: {}", request.getEmail());
                            return new RuntimeException("User or Admin not found: " + request.getEmail());
                        });
            });

    String email = account.getEmail();
    logger.info("Account found with email: {}", email);

    // Generate JWT and refresh tokens
    var jwtToken = jwtService.generateToken(account);
    var refreshToken = jwtService.generateRefreshToken(account);

    logger.info("Tokens generated for account with email: {}", email);

    return AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .build();
}


  // Refresh access token using refresh token
  public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;

    // Check if the authorization header is valid
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      logger.error("Invalid authorization header, missing Bearer token");
      return;
    }

    // Extract refresh token from header
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    
    logger.info("Refreshing token for user: {}", userEmail);

    if (userEmail != null) {
   // Fetch user or admin based on email from UserRepository or AdminRepository
BaseAccount account = userRepository.findByEmail(userEmail)
.map(user -> (BaseAccount) user) // If user is found, cast to BaseAccount
.orElseGet(() -> adminRepository.findByEmail(userEmail)
        .map(admin -> (BaseAccount) admin) // If admin is found, cast to BaseAccount
        .orElseThrow(() -> {
            logger.error("User or Admin not found for refresh token: {}", userEmail);
            return new RuntimeException("User or Admin not found");
        }));

// Check if the refresh token is valid
if (jwtService.isTokenValid(refreshToken, account)) {
// Generate new access token
var accessToken = jwtService.generateToken(account);

// Build the response with new tokens
var authResponse = AuthenticationResponse.builder()
    .accessToken(accessToken)
    .refreshToken(refreshToken)
    .build();

// Log the token refresh success
logger.info("Successfully refreshed token for account with email: {}", userEmail);

// Send the response back to the client
new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
} else {
logger.error("Invalid refresh token for account with email: {}", userEmail);
}
    }}}