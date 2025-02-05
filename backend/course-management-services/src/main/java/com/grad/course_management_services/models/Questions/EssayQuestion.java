package com.grad.course_management_services.models.Questions;

import com.grad.course_management_services.models.Quiz;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@DiscriminatorValue("ESSAY")
public class EssayQuestion extends Question {

    private String sampleAnswer;

    public EssayQuestion() {}
    public EssayQuestion(String text, double grade, Quiz quiz, String sampleAnswer,int order) {
        super(text, grade, quiz, order); // Call the superclass constructor with order
        this.sampleAnswer = sampleAnswer;
    }
    

    @Override
    public double calculateGrade() {
        // Custom grade calculation logic for Essay question
        return getGrade();
    }
}
