package com.grad.user_services.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "admins")
public class Admin extends BaseAccount {

    @Column(name = "position", nullable = false)
    private String position;

    @Column(name = "candidate")  // You can add nullable = false if needed
    private String candidate;

    public Admin() {
    }

    public Admin(String firstname, String lastname, String email, String password) {
        super(firstname, lastname, email, password, Role.ROLE_ADMIN);  // Default role is ROLE_ADMIN
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }

    @Override
    public void setRole() {
        if (this.role == null) {
            this.role = Role.ROLE_ADMIN.getRoleName();  // Default to ADMIN role if none provided
        }
    }
}
