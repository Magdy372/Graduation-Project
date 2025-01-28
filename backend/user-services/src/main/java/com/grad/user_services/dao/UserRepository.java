package com.grad.user_services.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grad.user_services.model.User;



public interface UserRepository extends JpaRepository<User, Integer> {
}