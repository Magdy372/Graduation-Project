package com.grad.user_services.controller;


import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.grad.user_services.dto.UserDTO;
import com.grad.user_services.dto.UserResponseDTO;
import com.grad.user_services.dto.UserWithDocumentsDTO;
import com.grad.user_services.model.BaseAccount;
import com.grad.user_services.model.User;
import com.grad.user_services.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;


   // Get User by ID

   @GetMapping("/{id}")
   public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
   
       if (authentication == null) {
           System.out.println("❌ Authentication is NULL! Check JWT Filter.");
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
       }
   
       System.out.println("✅ User Authenticated: " + authentication.getName());
       System.out.println("✅ User Authorities: " + authentication.getAuthorities()
               .stream().map(GrantedAuthority::getAuthority).toList());
   
       UserResponseDTO userResponseDTO = userService.getUserById(id);
       return userResponseDTO != null 
           ? ResponseEntity.ok(userResponseDTO) 
           : ResponseEntity.notFound().build();
   }
   
  @PostMapping("/add")
public ResponseEntity<User> addUser(@Valid @RequestBody User user, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        // Print validation errors
        bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    try {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    } catch (Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
    
}

   @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long userId, @Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        UserResponseDTO updatedUser = userService.updateUser(userId, userDTO);
        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updatedUser);
    }


     // Get All Users
    @GetMapping("/view-all")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

   
    @PostMapping(value = "/with-documents", consumes = "multipart/form-data")
    public ResponseEntity<?> createUserWithDocuments(
            @Valid @ModelAttribute UserWithDocumentsDTO userWithDocumentsDTO,
            BindingResult result) throws Exception {

        // Check for validation errors
     if (result.hasErrors()) {
    for (FieldError error : result.getFieldErrors()) {
        // Log or print each error's field and message
        System.out.println("Field: " + error.getField() + ", Error: " + error.getDefaultMessage());
    }
    // Return the errors back to the frontend
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getFieldErrors());
}


        try {
            // Save the user with documents
            User savedUser = userService.saveUserWithDocuments(userWithDocumentsDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            // Log the error and rethrow as a custom exception
            throw new Exception("Error creating user with documents: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
public ResponseEntity<?> approveUser(@PathVariable Long id) {
    boolean isApproved = userService.approveUser(id);
    
    if (!isApproved) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or already approved.");
    }
    
    return ResponseEntity.ok("User has been approved successfully.");
}

}