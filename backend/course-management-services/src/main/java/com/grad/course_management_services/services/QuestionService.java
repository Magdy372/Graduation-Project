package com.grad.course_management_services.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.grad.course_management_services.dao.QuestionRepository;
import com.grad.course_management_services.dao.QuizRepository;
import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.models.Quiz;
import com.grad.course_management_services.models.Questions.MCQQuestion;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.models.Questions.TrueFalseQuestion;

import jakarta.persistence.EntityNotFoundException;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    @Autowired
    private QuizRepository quizRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // Create a new question based on the DTO
  

    public Question createQuestion(QuestionDTO questionDTO) {
        // Find the quiz by ID
        Quiz quiz = quizRepository.findById(questionDTO.getQuizId())
            .orElseThrow(() -> new EntityNotFoundException("Quiz not found with id " + questionDTO.getQuizId()));
    
        // Determine the next order for the new question in the quiz
        int nextOrder = quiz.getQuestions().size() + 1;
    
        // Create the appropriate question based on the question type
        Question question = null;
        switch (questionDTO.getQuestionType()) {
            case "MCQ":
                // Serialize the options array to a JSON string
                String optionsJson = new Gson().toJson(questionDTO.getOptions());
    
                // Create the MCQQuestion with the serialized options and next order
                question = new MCQQuestion(
                        questionDTO.getText(),
                        questionDTO.getGrade(),
                        quiz,
                        questionDTO.getCorrectAnswer(),
                        optionsJson, // Use the serialized JSON string
                        nextOrder // Set the next available order
                );
                break;
    
            case "TRUE_FALSE":
                boolean correctAnswer = Boolean.parseBoolean(questionDTO.getCorrectAnswer());
                // Create the TrueFalseQuestion with next order
                question = new TrueFalseQuestion(
                        questionDTO.getText(),
                        questionDTO.getGrade(),
                        quiz,
                        correctAnswer,
                        nextOrder 
                );
                break;
    
            default:
                throw new IllegalArgumentException("Invalid question type");
        }
    
        // Save the created question to the database
        return questionRepository.save(question);
    }
    
    // Get all questions for a specific quiz
    public List<Question> getAllQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    // Get MCQ questions by quiz ID
    public List<MCQQuestion> getMCQQuestionsByQuizId(Long quizId) {
        return questionRepository.findMCQQuestionsByQuizId(quizId);
    }

    // Get True/False questions by quiz ID
    public List<TrueFalseQuestion> getTrueFalseQuestionsByQuizId(Long quizId) {
        return questionRepository.findTrueFalseQuestionsByQuizId(quizId);
    }

    // Get a question by ID
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id " + id));
    }

    // Update an existing question
    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = getQuestionById(id);
        question.setText(questionDetails.getText());
        question.setGrade(questionDetails.getGrade());
        return questionRepository.save(question);
    }

    // Delete a question by ID
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);
        questionRepository.delete(question);
    }
}
