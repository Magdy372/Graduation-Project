package com.grad.user_services.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.grad.user_services.dto.FeedbackDTO;
import com.grad.user_services.dto.FeedbackRequestDTO;
import com.grad.user_services.services.FeedbackService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackDTO> submitFeedback(@RequestBody FeedbackRequestDTO feedbackRequestDTO) {
        return ResponseEntity.ok(feedbackService.submitFeedback(feedbackRequestDTO));
    }

    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        return ResponseEntity.ok(feedbackService.getFeedbackInsights());
    }
}
