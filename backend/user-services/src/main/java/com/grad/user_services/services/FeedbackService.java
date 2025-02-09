package com.grad.user_services.services;

import com.grad.user_services.dao.FeedbackRepository;
import com.grad.user_services.dao.UserRepository;
import com.grad.user_services.dto.FeedbackDTO;
import com.grad.user_services.dto.FeedbackRequestDTO;
import com.grad.user_services.model.Feedback;
import com.grad.user_services.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.ToIntFunction;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;


    public FeedbackDTO submitFeedback(FeedbackRequestDTO feedbackRequestDTO) {
        User user = userRepository.findById(feedbackRequestDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setOverallRating(feedbackRequestDTO.getOverallRating());
        feedback.setEaseOfUseRating(feedbackRequestDTO.getEaseOfUseRating());
        feedback.setContentQualityRating(feedbackRequestDTO.getContentQualityRating());
        feedback.setSupportSatisfactionRating(feedbackRequestDTO.getSupportSatisfactionRating());
        feedback.setComments(feedbackRequestDTO.getComments());

        feedback = feedbackRepository.save(feedback);

        return mapToDTO(feedback);
    }

    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAll()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public Map<String, Object> getFeedbackInsights() {
        List<Feedback> allFeedbacks = feedbackRepository.findAll();
        
        return Map.of(
            "totalFeedbacks", allFeedbacks.size(),
            "averageOverall", calculateAverage(allFeedbacks, Feedback::getOverallRating),
            "averageEaseOfUse", calculateAverage(allFeedbacks, Feedback::getEaseOfUseRating),
            "averageContentQuality", calculateAverage(allFeedbacks, Feedback::getContentQualityRating),
            "averageSupport", calculateAverage(allFeedbacks, Feedback::getSupportSatisfactionRating)
        );
    }

    private double calculateAverage(List<Feedback> feedbacks, ToIntFunction<Feedback> mapper) {
        return feedbacks.stream()
            .mapToInt(mapper)
            .average()
            .orElse(0.0);
    }

    private FeedbackDTO mapToDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setUserName(feedback.getUser().getFirstname());
        dto.setOverallRating(feedback.getOverallRating());
        dto.setEaseOfUseRating(feedback.getEaseOfUseRating());
        dto.setContentQualityRating(feedback.getContentQualityRating());
        dto.setSupportSatisfactionRating(feedback.getSupportSatisfactionRating());
        dto.setComments(feedback.getComments());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
    
}
