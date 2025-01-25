package com.example.demo.services;

import com.example.demo.dto.UserWithDocumentsDTO;
import com.example.demo.model.User;
import com.example.demo.model.UserDocument;

import jakarta.validation.Valid;

import com.example.demo.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private FileStorageService fileStorageService;
    public User saveUserWithDocuments(@Valid @ModelAttribute UserWithDocumentsDTO userWithDocumentsDTO) {
        // Save files and get their paths
        String licenseFilePath = fileStorageService.store(userWithDocumentsDTO.getLicenseFile());
        String professionLicenseFilePath = fileStorageService.store(userWithDocumentsDTO.getProfessionLicenseFile());
        String syndicateCardFilePath = fileStorageService.store(userWithDocumentsDTO.getSyndicateCardFile());
        String commercialRegisterFilePath = fileStorageService.store(userWithDocumentsDTO.getCommercialRegisterFile());
        String taxCardFilePath = fileStorageService.store(userWithDocumentsDTO.getTaxCardFile());
    
        // Create and save User
        User user = new User();
        user.setFirstname(userWithDocumentsDTO.getFirstname());
        user.setLastname(userWithDocumentsDTO.getLastname());
        user.setPhonenumber(userWithDocumentsDTO.getPhonenumber());
        user.setEmail(userWithDocumentsDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userWithDocumentsDTO.getPassword()));
    
        // Create and save UserDocument
        UserDocument userDocument = new UserDocument();
        userDocument.setLicenseFilePath(licenseFilePath);
        userDocument.setProfessionLicenseFilePath(professionLicenseFilePath);
        userDocument.setSyndicateCardFilePath(syndicateCardFilePath);
        userDocument.setCommercialRegisterFilePath(commercialRegisterFilePath);
        userDocument.setTaxCardFilePath(taxCardFilePath);
    
        // Establish the relationship
        user.setUserDocument(userDocument);
        userDocument.setUser(user);
    
        // Save User (UserDocument will be saved automatically due to CascadeType.ALL)
        return userRepository.save(user);
    }
}