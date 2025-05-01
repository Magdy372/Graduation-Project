package com.grad.user_services.model;

import jakarta.persistence.*;

@Entity
@Table(name = "violations")
public class Violation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String startTime;
    private String endTime;    
    private Long duration;
    private String userId;
    private String quizId;
    private String violation;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

   public String getStartTime() { return startTime; }
    public void setStartTime(String start_time) { this.startTime = start_time; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String end_time) { this.endTime = end_time; }

    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }

    public String getViolation() { return violation; }
    public void setViolation(String violation) { this.violation = violation; }
}