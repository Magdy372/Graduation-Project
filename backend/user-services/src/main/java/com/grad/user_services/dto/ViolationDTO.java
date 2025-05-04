package com.grad.user_services.dto;

public class ViolationDTO {
    private String startTime;
    private String endTime; 
    private Long duration;
    private Long userId;
    private Long quizId;
    private String violation;
    private Long courseId;


    // Getters and Setters
    public Long getCourseId() {
        return courseId;
    }
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    public String getStartTime() { return startTime; }
    public void setStartTime(String start_time) { this.startTime = start_time; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String end_time) { this.endTime = end_time; }

    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }

    public String getViolation() { return violation; }
    public void setViolation(String violation) { this.violation = violation; }
}
