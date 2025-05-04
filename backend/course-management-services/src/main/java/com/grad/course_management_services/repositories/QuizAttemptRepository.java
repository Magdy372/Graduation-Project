package com.grad.course_management_services.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grad.course_management_services.dto.QuizAttemptResponseDTO;
import com.grad.course_management_services.models.QuizAttempt;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizIdAndUserId(Long quizId, Long userId);
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByUserId(Long userId);
    Optional<QuizAttempt> findTopByUserIdAndQuizIdOrderByScoreDesc(Long userId, Long quizId);
} 