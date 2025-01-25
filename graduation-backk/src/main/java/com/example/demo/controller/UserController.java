package com.example.demo.controller;

import com.example.demo.dto.UserWithDocumentsDTO;
import com.example.demo.model.User;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;

import org.springframework.http.MediaType; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
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