package com.grad.course_management_services.models;

import java.util.List;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.grad.course_management_services.models.Questions.Question;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.Column;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message="title is required")
    private String title;

    @ManyToOne
    @JoinColumn(name = "chapter_id", nullable = false)
    @JsonBackReference
    private Chapter chapter;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("order ASC") 
    private List<Question> questions = new ArrayList<>();

    private Double totalGrade;

    @Column(nullable = false)
    private Integer timeLimit = 30; // Default time limit of 30 minutes

    public Quiz() {
        this.timeLimit = 30; // Default time limit of 30 minutes
        this.questions = new ArrayList<>();
    }

    public Quiz(String title, Chapter chapter) {
        this.title = title;
        this.chapter = chapter;
        this.timeLimit = 30; // Default time limit of 30 minutes
        this.questions = new ArrayList<>();
    }
}
