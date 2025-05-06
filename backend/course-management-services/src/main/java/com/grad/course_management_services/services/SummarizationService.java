package com.grad.course_management_services.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.grad.course_management_services.dao.VideoRepository;
import com.grad.course_management_services.dto.SummarizationResponse;
import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.clients.SummarizationServiceClient;

@Service
public class SummarizationService {
      @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private SummarizationServiceClient summarizationClient;

    @Async
    public void triggerSummarization(Long videoId) {
        try {
            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new RuntimeException("Video not found"));

            Map<String, String> request = new HashMap<>();
            request.put("video_path", video.getVideoPath());
            request.put("method", "both");

            SummarizationResponse response = summarizationClient.summarizeVideo(request);

            System.out.println("Summarization Response: " + response);

            if (response != null && response.getSummary() != null) {
                video.setVideoSummary(response.getSummary());
                video.setGeminiSummary(response.getGemini());
                videoRepository.save(video);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
