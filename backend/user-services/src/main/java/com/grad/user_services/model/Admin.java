package com.grad.user_services.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "admins")
public class Admin extends BaseAccount {

    public Admin() {}

    public Admin(String firstname, String lastname, String email, String password) {
        super(firstname, lastname, email, password, Role.ROLE_ADMIN);  // Default role is ROLE_ADMIN
    }

    @Override
    public void setRole() {
        if (this.role == null) {
            this.role = Role.ROLE_ADMIN.getRoleName();  // Default to ADMIN role if none provided
        }
    }
}
