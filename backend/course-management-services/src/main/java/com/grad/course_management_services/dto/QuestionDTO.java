package com.grad.course_management_services.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class QuestionDTO {
    
    private Long id;
    private String questionType;  
    private String text;
    private double grade;
    private Long quizId;
    private String correctAnswer; 
    private String[] options;     
    public QuestionDTO() {
    }

    public QuestionDTO(String questionType, String text, double grade, Long quizId, String correctAnswer, String[] options) {
        this.questionType = questionType;
        this.text = text;
        this.grade = grade;
        this.quizId = quizId;
        this.correctAnswer = correctAnswer;
        this.options = options;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public double getGrade() {
        return grade;
    }

    public void setGrade(double grade) {
        this.grade = grade;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String[] getOptions() {
        return options;
    }

    public void setOptions(String[] options) {
        this.options = options;
    }
}
