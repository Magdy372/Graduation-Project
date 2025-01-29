package com.grad.user_services.controller;


import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.grad.user_services.dto.UserWithDocumentsDTO;
import com.grad.user_services.model.User;
import com.grad.user_services.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(user);
    }
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        try {
            User savedUser = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);  // Return the created user
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);  // Handle any errors
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers(); // Assume this method exists in the service
        return ResponseEntity.ok(users);
    }
    @PostMapping(value = "/with-documents", consumes = "multipart/form-data")
    public ResponseEntity<User> createUserWithDocuments(
        @RequestPart("firstname") String firstname,
        @RequestPart("lastname") String lastname,
        @RequestPart("phonenumber") String phonenumber,
        @RequestPart("email") String email,
        @RequestPart("password") String password,
        @RequestPart("licenseFile") MultipartFile licenseFile,
        @RequestPart("professionLicenseFile") MultipartFile professionLicenseFile,
        @RequestPart("syndicateCardFile") MultipartFile syndicateCardFile,
        @RequestPart("commercialRegisterFile") MultipartFile commercialRegisterFile,
        @RequestPart("taxCardFile") MultipartFile taxCardFile
    ) {
        UserWithDocumentsDTO userWithDocumentsDTO = new UserWithDocumentsDTO();
        userWithDocumentsDTO.setFirstname(firstname);
        userWithDocumentsDTO.setLastname(lastname);
        userWithDocumentsDTO.setPhonenumber(phonenumber);
        userWithDocumentsDTO.setEmail(email);
        userWithDocumentsDTO.setPassword(password);
    
        userWithDocumentsDTO.setLicenseFile(licenseFile);
        userWithDocumentsDTO.setProfessionLicenseFile(professionLicenseFile);
        userWithDocumentsDTO.setSyndicateCardFile(syndicateCardFile);
        userWithDocumentsDTO.setCommercialRegisterFile(commercialRegisterFile);
        userWithDocumentsDTO.setTaxCardFile(taxCardFile);
    
        User savedUser = userService.saveUserWithDocuments(userWithDocumentsDTO);
        return ResponseEntity.ok(savedUser);
    }
}