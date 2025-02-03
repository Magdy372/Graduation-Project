package com.grad.user_services.services;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.grad.user_services.dao.AdminRepository;
import com.grad.user_services.dao.UserRepository;
import com.grad.user_services.model.BaseAccount;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@ToString
@Data
@Setter
@EqualsAndHashCode
@Getter
@AllArgsConstructor
@Service

public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Try to find an Admin first
        BaseAccount account = adminRepository.findByEmail(email)
                .map(admin -> (BaseAccount) admin) // Ensure casting Admin to BaseAccount
                .orElseGet(() -> userRepository.findByEmail(email)
                        .map(user -> (BaseAccount) user) // Ensure casting User to BaseAccount
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email)));
    
        return new org.springframework.security.core.userdetails.User(
                account.getEmail(),
                account.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(account.getRole()))
        );
    }
    
}
