package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dao.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Upload a video to a chapter
    public Video uploadVideo(Long chapterId, MultipartFile file, String title) throws IOException {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        String videoPath = fileStorageService.storeVideo(file);

        Video video = new Video();
        video.setTitle(title);
        video.setVideoPath(videoPath);
        video.setChapter(chapter);

        return videoRepository.save(video);
    }

    // Get all videos for a specific chapter
    public List<Video> getVideosByChapter(Long chapterId) {
        return videoRepository.findByChapterId(chapterId);
    }

    // Delete a video by ID (including file removal)
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
