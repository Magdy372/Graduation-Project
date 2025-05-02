package com.grad.user_services.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.grad.user_services.dto.AdminProfileDTO;
import com.grad.user_services.model.Admin;
import com.grad.user_services.model.Contact;
import com.grad.user_services.services.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/profile/{email}")
    public ResponseEntity<AdminProfileDTO> getAdminProfile(@PathVariable String email) {
        AdminProfileDTO profile = adminService.getAdminProfile(email);
        return profile != null ? ResponseEntity.ok(profile) : ResponseEntity.notFound().build();
    }
    @PostMapping("/create")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        Admin newAdmin = adminService.createAdmin(admin);
        return newAdmin != null ? ResponseEntity.status(HttpStatus.CREATED).body(newAdmin)
                                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    // Approve user
    @PutMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        boolean isApproved = adminService.approveUser(id);

        if (!isApproved) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or already approved.");
        }

        return ResponseEntity.ok("User has been approved successfully.");
    }
} 