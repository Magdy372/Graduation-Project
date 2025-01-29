package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.dao.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    // Get all videos
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Get video by ID
    public Optional<Video> getVideoById(Long id) {
        return videoRepository.findById(id);
    }

    // Get videos by chapter ID
    public List<Video> getVideosByChapterId(Long chapterId) {
        return videoRepository.findByChapterId(chapterId);
    }

    // Create or update a video
    public Video saveVideo(Video video) {
        return videoRepository.save(video);
    }

    // Delete a video
    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }
}
