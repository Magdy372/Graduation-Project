package com.grad.user_services.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String position;
} 