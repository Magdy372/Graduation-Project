package com.grad.course_management_services.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.dto.QuizDTO;
import com.grad.course_management_services.services.QuizService;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // ✅ Create a new quiz
    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody QuizDTO quizDTO) {
        QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
        return ResponseEntity.status(201).body(createdQuiz);
    }

    // ✅ Get all quizzes
    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    // ✅ Get a quiz by ID
    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long quizId) {
        QuizDTO quiz = quizService.getQuizById(quizId);
        return ResponseEntity.ok(quiz);
    }

    // ✅ Get quizzes by chapter
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesByChapter(@PathVariable Long chapterId) {
        return ResponseEntity.ok(quizService.getQuizzesByChapter(chapterId));
    }

    // ✅ Update a quiz
    @PutMapping("/{quizId}")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long quizId, @RequestBody QuizDTO updatedQuizDTO) {
        QuizDTO quiz = quizService.updateQuiz(quizId, updatedQuizDTO);
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


