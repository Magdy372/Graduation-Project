package com.grad.course_management_services.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    private Long userId;

    private Double score;

    private LocalDateTime attemptDate;

    private Integer attemptNumber;

    private Boolean passed;

    public QuizAttempt(Quiz quiz, Long userId) {
        this.quiz = quiz;
        this.userId = userId;
        this.attemptDate = LocalDateTime.now();
        this.attemptNumber = 1;
    }
} 