package com.example.demo.services;

import com.example.demo.model.UserDocument;
import com.example.demo.dao.UserDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserDocumentService {

    @Autowired
    private UserDocumentRepository userDocumentRepository;

    public UserDocument saveDocument(UserDocument document) {
        return userDocumentRepository.save(document);
    }


}