package com.grad.course_management_services.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ViolationDTO {
    private Long id;
    private String startTime;
    private String endTime;
    private Long duration;
    private Long userId;
    private Long quizId;
    private Long courseId;
    private String violation;
}
