package com.grad.user_services.model;

// Core JPA imports - *** Note the corrected Id import ***
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; // <-- CORRECTED IMPORT
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType; // Optional: Consider adding FetchType for relationships

// Validation imports
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email; // Added for email validation

@Entity
@Table(name = "contact") // Specifies the table name in the database
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Message is required")
    private String mess; // Storing only the message field

    // Default constructor required by JPA/Hibernate
    public Contact() {
    }

    // Constructor that accepts user and message only
    public Contact(User user, String mess) {
        this.user = user;
        this.mess = mess;
    }

    // Getter and Setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMess() {
        return mess;
    }

    public void setMess(String mess) {
        this.mess = mess;
    }

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", mess='" + mess + '\'' +
                '}';
    }
}