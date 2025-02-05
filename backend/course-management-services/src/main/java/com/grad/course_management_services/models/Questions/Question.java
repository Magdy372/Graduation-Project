package com.grad.course_management_services.models.Questions;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.grad.course_management_services.models.Quiz;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Single Table Strategy
@DiscriminatorColumn(name = "question_type", discriminatorType = DiscriminatorType.STRING)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "question_type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = MCQQuestion.class, name = "MCQ"),
    @JsonSubTypes.Type(value = EssayQuestion.class, name = "ESSAY"),
    @JsonSubTypes.Type(value = TrueFalseQuestion.class, name = "TRUE_FALSE")
})
public abstract class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private double grade;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonBackReference
    private Quiz quiz;
    @Column(name="order_num",nullable = false)
    private int order;

    public Question() {}

    public Question(String text, double grade, Quiz quiz,int order) {
        this.text = text;
        this.grade = grade;
        this.quiz = quiz;
        this.order=order;
    }

    public abstract double calculateGrade(); // Strategy Method
}
