package com.grad.course_management_services.models.Questions;

import com.grad.course_management_services.models.Quiz;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@DiscriminatorValue("MCQ")
public class MCQQuestion extends Question {
    
    private String correctAnswer;
    private String options;

    public MCQQuestion() {}

    public MCQQuestion(String text, double grade, Quiz quiz, String correctAnswer, String options,int order) {
        super(text, grade, quiz,order);
        this.correctAnswer = correctAnswer;
        this.options = options;
        
    }

    @Override
    public double calculateGrade() {
        return getGrade();
    }
}
