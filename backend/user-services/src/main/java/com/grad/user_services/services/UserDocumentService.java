package com.grad.user_services.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grad.user_services.dao.UserDocumentRepository;
import com.grad.user_services.model.UserDocument;



@Service
public class UserDocumentService {

    @Autowired
    private UserDocumentRepository userDocumentRepository;

    public UserDocument saveDocument(UserDocument document) {
        return userDocumentRepository.save(document);
    }


}