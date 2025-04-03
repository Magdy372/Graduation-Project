package com.grad.user_services.dao;

import com.grad.user_services.model.Contact;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    // Method to retrieve all messages (contacts)
    List<Contact> findAll();  // JpaRepository already provides a built-in method for this.
}
