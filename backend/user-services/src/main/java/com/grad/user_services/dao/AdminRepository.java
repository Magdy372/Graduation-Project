package com.grad.user_services.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grad.user_services.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}
