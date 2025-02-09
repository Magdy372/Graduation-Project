package com.grad.user_services.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Min(1) @Max(5) @NotNull
    private int overallRating;

    @Min(1) @Max(5) @NotNull
    private int easeOfUseRating;

    @Min(1) @Max(5) @NotNull
    private int contentQualityRating;

    @Min(1) @Max(5) @NotNull
    private int supportSatisfactionRating;

    @Column(length = 1000)
    private String comments;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
