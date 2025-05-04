package com.grad.user_services.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class QuizAttemptResponseDTO {
    private Long id;
    private Long userId;
    private Long quizId;
    private Double score;
    private List<ViolationDTO> violations;

    // Getters & Setters
}
