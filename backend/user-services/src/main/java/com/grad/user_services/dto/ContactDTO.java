package com.grad.user_services.dto;

import jakarta.validation.constraints.NotBlank;

public class ContactDTO {
    private Long id;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String senderName;
    private String senderEmail;

    // Constructor for creating new messages
    public ContactDTO(String message) {
        this.message = message;
    }

    // Constructor for receiving messages
    public ContactDTO(Long id, String message, String senderName, String senderEmail) {
        this.id = id;
        this.message = message;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }
}
    