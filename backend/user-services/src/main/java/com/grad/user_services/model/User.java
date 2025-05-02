package com.grad.user_services.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

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

    
    @Column(name = "title")
    @NotBlank(message = "Title is required")
    private String title;

    
  

    @Column(name = "approved")
    private boolean approved;

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public User(String firstname, String lastname, String email, String password) {
        super(firstname, lastname, email, password, Role.ROLE_USER);
    }

    @Override
    public void setRole() {
        if (this.role == null) {
            this.role = Role.ROLE_USER.getRoleName();
        }
    }

}
