package com.grad.course_management_services.controllers;

import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.services.ChapterService;
import com.grad.course_management_services.services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;
     @Autowired
    private ChapterService chapterService;

    // Get all videos
    @GetMapping
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    // Get video by ID
    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        Optional<Video> video = videoService.getVideoById(id);
        return video.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get videos by chapter ID
    @GetMapping("/chapter/{chapterId}")
    public List<Video> getVideosByChapterId(@PathVariable Long chapterId) {
        return videoService.getVideosByChapterId(chapterId);
    }

    // Create or update video
    @PostMapping
    public ResponseEntity<Video> createOrUpdateVideo(@RequestBody Video video) {
        Video savedVideo = videoService.saveVideo(video);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVideo);
    }

    // Delete video
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
      // Endpoint to upload a video
    @PostMapping("/upload/{chapterId}")
    public Video uploadVideo(@RequestParam("file") MultipartFile file, @PathVariable Long chapterId) throws IOException {
        return chapterService.saveVideo(file, chapterId);
    }
}
