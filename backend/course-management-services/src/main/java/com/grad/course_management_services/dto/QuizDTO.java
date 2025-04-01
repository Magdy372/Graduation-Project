package com.grad.course_management_services.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizDTO {
    private Long id;
    private String title;
    private Long chapterId;
    private Double totalGrade;
    private Integer timeLimit;
    private List<QuestionDTO> questions;

    public QuizDTO() {
        this.timeLimit = 30; // Default time limit
    }

    public QuizDTO(String title, Long chapterId) {
        this.title = title;
        this.chapterId = chapterId;
        this.timeLimit = 30; // Default time limit
    }
} 