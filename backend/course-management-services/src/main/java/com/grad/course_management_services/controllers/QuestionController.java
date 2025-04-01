package com.grad.course_management_services.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.models.Questions.MCQQuestion;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.models.Questions.TrueFalseQuestion;
import com.grad.course_management_services.services.QuestionService;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Create a new question
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionDTO questionDTO) {
        // Create the question using the service method
        Question createdQuestion = questionService.createQuestion(questionDTO);

        // Return a response with the created question and a status of CREATED (HTTP 201)
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    // Get all MCQ questions by quiz ID
    @GetMapping("/quiz/{quizId}/mcq")
    public ResponseEntity<List<MCQQuestion>> getMCQQuestionsByQuizId(@PathVariable Long quizId) {
        List<MCQQuestion> questions = questionService.getMCQQuestionsByQuizId(quizId);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    // Get all True/False questions by quiz ID
    @GetMapping("/quiz/{quizId}/truefalse")
    public ResponseEntity<List<TrueFalseQuestion>> getTrueFalseQuestionsByQuizId(@PathVariable Long quizId) {
        List<TrueFalseQuestion> questions = questionService.getTrueFalseQuestionsByQuizId(quizId);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    // Get a question by ID
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        return new ResponseEntity<>(question, HttpStatus.OK);
    }

    // Update a question
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        Question updatedQuestion = questionService.updateQuestion(id, questionDetails);
        return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
    }

    // Delete a question
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

