package com.grad.user_services.dto;

public class ViolationDTO {
    private String timestamp;
    private String userId;
    private String quizId;
    private String violation;

    // Getters and Setters
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }

    public String getViolation() { return violation; }
    public void setViolation(String violation) { this.violation = violation; }
}
