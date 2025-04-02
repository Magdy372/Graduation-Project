package com.grad.user_services.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.grad.user_services.Exceptions.AuthenticationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse authenticationResponse = service.authenticate(request);
            return ResponseEntity.ok(authenticationResponse);
        } catch (AuthenticationException e) {
            return handleAuthenticationException(e);
        }
    }

    private ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        
        switch (e.getMessage()) {
            case "Invalid email or password.":
                response.put("status", "error");
                response.put("message", "Invalid email or password");
                response.put("errors", Map.of(
                    "general", "Invalid email or password. Please try again."
                ));
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

            case "Your account is under review. Please wait for approval.":
                response.put("status", "error");
                response.put("message", "Account pending approval");
                response.put("errors", Map.of(
                    "email", "Your email is under approval. Please wait for admin verification."
                ));
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);

            default:
                response.put("status", "error");
                response.put("message", "An unexpected error occurred");
                response.put("errors", Map.of(
                    "general", "An unexpected error occurred. Please try again."
                ));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }
}
