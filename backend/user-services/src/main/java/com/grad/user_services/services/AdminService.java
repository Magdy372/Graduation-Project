package com.grad.user_services.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grad.user_services.dao.AdminRepository;
import com.grad.user_services.dao.UserRepository;
import com.grad.user_services.dto.AdminProfileDTO;
import com.grad.user_services.model.User;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminProfileDTO getAdminProfile(String email) {
        return adminRepository.findByEmail(email)
                .map(admin -> new AdminProfileDTO(
                    admin.getId(),
                    admin.getFirstname(),
                    admin.getLastname(),
                    admin.getEmail(),
                    admin.getPosition()
                ))
                .orElse(null);
    }

    public boolean approveUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!user.isApproved()) {  // Check if not already approved
                user.setApproved(true);
                userRepository.save(user);
                return true;
            }
        }
        
        return false;
    }
} 