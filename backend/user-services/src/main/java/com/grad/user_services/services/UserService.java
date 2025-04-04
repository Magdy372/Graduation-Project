package com.grad.user_services.services;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.grad.user_services.dao.AdminRepository;
import com.grad.user_services.dao.ContactRepository;
import com.grad.user_services.dao.UserRepository;
import com.grad.user_services.dto.UserDTO;
import com.grad.user_services.dto.UserResponseDTO;
import com.grad.user_services.dto.UserWithDocumentsDTO;
import com.grad.user_services.model.Admin;
import com.grad.user_services.model.BaseAccount;
import com.grad.user_services.model.Contact;
import com.grad.user_services.model.User;
import com.grad.user_services.model.UserDocument;
import com.grad.user_services.dto.AdminProfileDTO;
import com.grad.user_services.dto.ContactDTO;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private FileValidationService fileValidationService;
    @Autowired
    private ContactRepository contactRepository;


    public User saveUser(@Valid User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole();
        // Save the user without documents
        return userRepository.save(user);
    }
    // Get User by ID
    public UserResponseDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToUserResponseDTO)
                .orElse(null);
    }
    
    
    public User saveUserWithDocuments(@Valid @ModelAttribute UserWithDocumentsDTO userWithDocumentsDTO) {
        // Validate all files
        validateUserDocuments(userWithDocumentsDTO);

        // Save files and get their paths
        String licenseFilePath = fileStorageService.store(userWithDocumentsDTO.getLicenseFile());
        String professionLicenseFilePath = fileStorageService.store(userWithDocumentsDTO.getProfessionLicenseFile());
        String syndicateCardFilePath = fileStorageService.store(userWithDocumentsDTO.getSyndicateCardFile());
        String commercialRegisterFilePath = fileStorageService.store(userWithDocumentsDTO.getCommercialRegisterFile());
        String taxCardFilePath = fileStorageService.store(userWithDocumentsDTO.getTaxCardFile());
    
        // Create and save User
        User user = new User();
        user.setFirstname(userWithDocumentsDTO.getFirstname());
        user.setTitle(userWithDocumentsDTO.getTitle());
        user.setGovernorate(userWithDocumentsDTO.getGovernorate());
        user.setLastname(userWithDocumentsDTO.getLastname());
        user.setPhonenumber(userWithDocumentsDTO.getPhonenumber());
        user.setEmail(userWithDocumentsDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userWithDocumentsDTO.getPassword()));
        user.setRole();
    
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

    private void validateUserDocuments(UserWithDocumentsDTO userWithDocumentsDTO) {
        fileValidationService.validateFile(userWithDocumentsDTO.getLicenseFile(), "License");
        fileValidationService.validateFile(userWithDocumentsDTO.getProfessionLicenseFile(), "Profession License");
        fileValidationService.validateFile(userWithDocumentsDTO.getSyndicateCardFile(), "Syndicate Card");
        fileValidationService.validateFile(userWithDocumentsDTO.getCommercialRegisterFile(), "Commercial Register");
        fileValidationService.validateFile(userWithDocumentsDTO.getTaxCardFile(), "Tax Card");
    }

    // Get All Users
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponseDTO)
                .collect(Collectors.toList());
    }

    // Get Unaccepted Users
    public List<UserResponseDTO> getUnacceptedUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> !user.isApproved())
                .map(this::mapToUserResponseDTO)
                .collect(Collectors.toList());
    }

    // Get Approved Users by Title
    public List<UserResponseDTO> getApprovedUsersByTitle(String title) {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.isApproved() && user.getTitle().equals(title))
                .map(this::mapToUserResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper method to map User to UserResponseDTO
    private UserResponseDTO mapToUserResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setFirstname(user.getFirstname());
        userResponseDTO.setLastname(user.getLastname());
        userResponseDTO.setPhonenumber(user.getPhonenumber());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setTitle(user.getTitle());
        userResponseDTO.setGovernorate(user.getGovernorate());
    
        // Map document fields if the user has documents
        if (user.getUserDocument() != null) {
            userResponseDTO.setLicenseFilePath(user.getUserDocument().getLicenseFilePath());
            userResponseDTO.setProfessionLicenseFilePath(user.getUserDocument().getProfessionLicenseFilePath());
            userResponseDTO.setSyndicateCardFilePath(user.getUserDocument().getSyndicateCardFilePath());
            userResponseDTO.setCommercialRegisterFilePath(user.getUserDocument().getCommercialRegisterFilePath());
            userResponseDTO.setTaxCardFilePath(user.getUserDocument().getTaxCardFilePath());
        }
    
        return userResponseDTO;
    }

    // Update User
    public UserResponseDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setFirstname(userDTO.getFirstname());
            user.setLastname(userDTO.getLastname());
            user.setPhonenumber(userDTO.getPhonenumber());
            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

            User updatedUser = userRepository.save(user);
            return mapToUserResponseDTO(updatedUser);
        }
        return null;
    }

    // This method retrieves a user by their email address
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Contact saveContactFrom(ContactDTO contactDTO, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Contact contact = new Contact(user, contactDTO.getMessage());
        return contactRepository.save(contact);
    }
    
    public List<ContactDTO> getAllMessages() {
        return contactRepository.findAll().stream()
            .map(contact -> new ContactDTO(
                contact.getId(),
                contact.getMess(),
                contact.getUser().getFirstname() + " " + contact.getUser().getLastname(),
                contact.getUser().getEmail()
            ))
            .collect(Collectors.toList());
    }
}
