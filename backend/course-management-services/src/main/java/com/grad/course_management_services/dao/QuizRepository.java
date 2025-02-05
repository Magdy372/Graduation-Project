package com.grad.course_management_services.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grad.course_management_services.models.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    // Custom Query: Find quizzes by chapter
    List<Quiz> findByChapterId(Long chapterId);
}
