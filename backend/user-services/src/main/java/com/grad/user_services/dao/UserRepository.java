package com.grad.user_services.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grad.user_services.model.Admin;
import com.grad.user_services.model.User;



public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByEmailAndApproved(String email, boolean approved);
}