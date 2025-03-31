package com.grad.user_services.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.grad.user_services.Exceptions.AuthenticationException;
import java.io.IOException;
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
        switch (e.getMessage()) {
            case "Invalid email or password.":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password")); // 401 Unauthorized

            case "Your account is under review. Please wait for approval.":
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Your account is under review. Please wait for approval.")); // 403 Forbidden

            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "An unexpected error occurred.")); // 500 Internal Server Error
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }
}
