package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.clients.SummarizationServiceClient;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dao.VideoRepository;
import com.grad.course_management_services.dto.SummarizationResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private SummarizationServiceClient summarizationClient;

    @Autowired
    private SummarizationService summarizationService;

    // Upload a video to a chapter
    // Upload a video and save it to the database
    @Transactional
    public Video uploadVideo(Long chapterId, MultipartFile file, String title) throws IOException {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        String videoPath = fileStorageService.storeVideo(file);

        Video video = new Video();
        video.setTitle(title);
        video.setVideoPath(videoPath);
        video.setChapter(chapter);

        // Save the video without waiting for summarization
        Video savedVideo = videoRepository.save(video);

        // Trigger summarization asynchronously
        summarizationService.triggerSummarization(savedVideo.getId());

        return savedVideo;
    }

    // Asynchronously trigger summarization
    // @Async
    // public void triggerSummarization(Long videoId) {
    //     try {
    //         Video video = videoRepository.findById(videoId)
    //                 .orElseThrow(() -> new RuntimeException("Video not found"));

    //         String method = "both";  // or "medical", "gemini"
    //         Map<String, String> request = new HashMap<>();
    //         request.put("video_path", video.getVideoPath());
    //         request.put("method", method);

    //         // Call the summarization service
    //         SummarizationResponse response = summarizationClient.summarizeVideo(request);

    //         System.out.println("Summarization Response: " + response);
    //         System.out.println("Transcription: " + response.getTranscription());
    //         System.out.println("Medical Summary: " + response.getSummary());
    //         System.out.println("Gemini Summary: " + response.getGemini());

    //         // Update the video with the summary
    //         if (response != null && response.getSummary() != null) {
    //             video.setVideoSummary(response.getSummary());
    //             video.setGeminiSummary(response.getGemini());
    //             videoRepository.save(video);
    //         } else {
    //             throw new RuntimeException("Summarization response was null");
    //         }
    //     } catch (Exception e) {
    //         // Handle summarization failure (e.g., log the error)
    //         e.printStackTrace();
    //     }
    // }
    
    // Get all videos for a specific chapter
    public List<Video> getVideosByChapter(Long chapterId) {
        return videoRepository.findByChapterId(chapterId);
    }

    // Delete a video by ID
    public void deleteVideo(Long videoId) {
        Optional<Video> videoOptional = videoRepository.findById(videoId);
        if (videoOptional.isPresent()) {
            Video video = videoOptional.get();
            String filename = video.getVideoPath().replace("/uploads/videos/", ""); // Extract filename

            // Delete video file
            boolean fileDeleted = fileStorageService.deleteVideoFile(filename);
            if (fileDeleted) {
                videoRepository.deleteById(videoId);
            } else {
                throw new RuntimeException("Failed to delete video file.");
            }
        } else {
            throw new RuntimeException("Video not found.");
        }
    }

    // Update video title
    public Video updateVideoTitle(Long videoId, String newTitle) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        video.setTitle(newTitle);
        return videoRepository.save(video);
    }
}
