package com.grad.user_services.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.grad.user_services.dto.AdminProfileDTO;
import com.grad.user_services.model.Contact;
import com.grad.user_services.services.UserService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile/{email}")
    public ResponseEntity<AdminProfileDTO> getAdminProfile(@PathVariable String email) {
        AdminProfileDTO profile = userService.getAdminProfile(email);
        return profile != null ? ResponseEntity.ok(profile) : ResponseEntity.notFound().build();
    }


} 