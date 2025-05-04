package com.grad.course_management_services.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttemptDTO {
    private Long id;
    private Long quizId;
    private Long userId;
    private Double score;
    private LocalDateTime attemptDate;
    private Integer attemptNumber;
    private Boolean passed;
} 