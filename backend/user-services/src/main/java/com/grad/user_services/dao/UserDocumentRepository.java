package com.grad.user_services.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grad.user_services.model.UserDocument;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
}