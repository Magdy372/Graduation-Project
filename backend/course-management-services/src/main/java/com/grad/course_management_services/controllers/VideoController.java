package com.grad.course_management_services.controllers;

import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    
    @Autowired
    private VideoService videoService;
    
    // Upload a video to a chapter
    @PostMapping("/upload/{chapterId}")
    public ResponseEntity<Video> uploadVideo(@PathVariable Long chapterId, 
                                             @RequestParam("file") MultipartFile file,
                                             @RequestParam("title") String title) {
        try {
            Video video = videoService.uploadVideo(chapterId, file, title);
            return new ResponseEntity<>(video, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }   
    
    // Get all videos of a chapter
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<Video>> getVideosByChapter(@PathVariable Long chapterId) {
        List<Video> videos = videoService.getVideosByChapter(chapterId);
        return ResponseEntity.ok(videos);
    }
    
    // Delete a video
    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
        return ResponseEntity.noContent().build();
    }
    
    // Update video title
    @PutMapping("/{videoId}/update-title")
    public ResponseEntity<Video> updateVideoTitle(@PathVariable Long videoId, @RequestParam("title") String newTitle) {
        Video updatedVideo = videoService.updateVideoTitle(videoId, newTitle);
        return ResponseEntity.ok(updatedVideo);
    }
}
