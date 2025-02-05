package com.grad.course_management_services.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.grad.course_management_services.models.Questions.EssayQuestion;
import com.grad.course_management_services.models.Questions.MCQQuestion;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.models.Questions.TrueFalseQuestion;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Find questions by quiz ID
    List<Question> findByQuizId(Long quizId);

    // Find MCQ Questions
    @Query("SELECT q FROM MCQQuestion q WHERE q.quiz.id = :quizId")
    List<MCQQuestion> findMCQQuestionsByQuizId(@Param("quizId") Long quizId);

    // Find Essay Questions
    @Query("SELECT q FROM EssayQuestion q WHERE q.quiz.id = :quizId")
    List<EssayQuestion> findEssayQuestionsByQuizId(@Param("quizId") Long quizId);

    // Find True/False Questions
    @Query("SELECT q FROM TrueFalseQuestion q WHERE q.quiz.id = :quizId")
    List<TrueFalseQuestion> findTrueFalseQuestionsByQuizId(@Param("quizId") Long quizId);
}
