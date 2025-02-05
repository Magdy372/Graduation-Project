package com.grad.user_services.model;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter

@Setter
@ToString

@NoArgsConstructor
@AllArgsConstructor

public class User extends BaseAccount {

    @NotBlank(message = "Phone number is required")
    @Size(max = 15, message = "Phone number must be less than 15 characters")
    @Column(name = "phone_number")
    private String phonenumber;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_document_id", referencedColumnName = "id")
    private UserDocument userDocument;
 

    @Column(name = "approved")
    private boolean approved;

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    // Constructor to initialize with fields
    public User(String firstname, String lastname, String email, String password) {
        super(firstname, lastname, email, password, Role.ROLE_USER);  // Default role is USER
    }


    @Override
    public void setRole() {
        if (this.role == null) {
            this.role = Role.ROLE_USER.getRoleName(); 
        }
    }
    
}