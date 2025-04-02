package com.grad.user_services.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Lombok annotations can reduce boilerplate (optional)
// import lombok.Data;


    public class ContactDTO {

        @NotBlank(message = "Message is required")
        private String message;  // Changed from 'mess' for clarity
    
        // Constructor that only takes message
        public ContactDTO(String mess) {
            this.message = mess;
        }
    
        // Getter and Setter for message
        public String getMessage() {
            return message;
        }
    
        public void setMessage(String message) {
            this.message = message;
        }
    }
    