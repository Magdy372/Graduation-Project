package com.grad.user_services.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequestDTO {
    @NotNull
    private Long userId; // Only need user ID for input

    @Min(1) @Max(5) @NotNull
    private int overallRating;

    @Min(1) @Max(5) @NotNull
    private int easeOfUseRating;

    @Min(1) @Max(5) @NotNull
    private int contentQualityRating;

    @Min(1) @Max(5) @NotNull
    private int supportSatisfactionRating;

    private String comments;
}
