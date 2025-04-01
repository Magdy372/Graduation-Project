package com.grad.course_management_services.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class QuestionDTO {
    
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
}
