package com.grad.course_management_services.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private LocalDateTime issueDate;

    @Column(nullable = false)
    private String certificateNumber;

    @Column(nullable = false)
    private Double finalScore;

    @Column(nullable = false)
    private Boolean passed;
    
    @Column(nullable = false)
    private String status = "PENDING";  // Default value

}
