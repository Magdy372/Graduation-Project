package com.grad.course_management_services.controllers;

import com.grad.course_management_services.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/test")
    public ResponseEntity<String> testEmail(@RequestParam String to) {
        try {
            emailService.sendSimpleEmail(
                to,
                "Test Email from Course System",
                "<h1>Test Email</h1><p>This is a test email from your course system.</p>"
            );
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/test-completion")
    public ResponseEntity<String> testCompletionEmail(
            @RequestParam String to,
            @RequestParam String userName,
            @RequestParam String courseName,
            @RequestParam Double finalScore,
            @RequestParam String certificateNumber) {
        try {
            // Generate a test certificate number
            //String certificateNumber = "CERT-" + System.currentTimeMillis();
            
            // Send certificate email with test data
            emailService.sendCertificateEmail(
                to,
                userName,
                courseName,
                certificateNumber,
                finalScore // Example score
            );
            
            return ResponseEntity.ok("Course completion email sent successfully to: " + to);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Failed to send completion email: " + e.getMessage());
        }
    }
} 