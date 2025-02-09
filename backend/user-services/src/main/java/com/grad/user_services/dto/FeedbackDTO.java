package com.grad.user_services.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedbackDTO {
    private Long id;
    private String userName; // Only return user name instead of full User entity
    private int overallRating;
    private int easeOfUseRating;
    private int contentQualityRating;
    private int supportSatisfactionRating;
    private String comments;
    private LocalDateTime createdAt;
}
