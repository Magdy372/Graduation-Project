package com.grad.course_management_services.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.models.Quiz;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.services.QuizService;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // ✅ Create a new quiz
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz createdQuiz = quizService.createQuiz(quiz);
        return ResponseEntity.status(201).body(createdQuiz);
    }

    // ✅ Get all quizzes
    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    // ✅ Get a quiz by ID
    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        return ResponseEntity.ok(quiz);
    }

    // ✅ Get quizzes by chapter
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<Quiz>> getQuizzesByChapter(@PathVariable Long chapterId) {
        return ResponseEntity.ok(quizService.getQuizzesByChapter(chapterId));
    }

    // ✅ Update a quiz
    @PutMapping("/{quizId}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long quizId, @RequestBody Quiz updatedQuiz) {
        Quiz quiz = quizService.updateQuiz(quizId, updatedQuiz);
        return ResponseEntity.ok(quiz);
    }

    // ✅ Delete a quiz
    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.noContent().build();
    }


    // ✅ Get all questions for a quiz
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuestionsByQuiz(quizId));
    }

    // ✅ Delete a question from a quiz
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
}


