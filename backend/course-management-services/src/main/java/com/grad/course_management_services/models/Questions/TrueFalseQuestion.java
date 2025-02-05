package com.grad.course_management_services.models.Questions;

import com.grad.course_management_services.models.Quiz;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@DiscriminatorValue("TRUE_FALSE")
public class TrueFalseQuestion extends Question {

    private boolean correctAnswer;

    public TrueFalseQuestion() {}
    public TrueFalseQuestion(String text, double grade, Quiz quiz, boolean correctAnswer, int order) {
        super(text, grade, quiz, order); // Call the superclass constructor with order
        this.correctAnswer = correctAnswer;
    }
    
    @Override
    public double calculateGrade() {
        return getGrade();
    }


    // Getters and Setters
}
