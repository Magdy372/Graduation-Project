package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dao.VideoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ChapterService {
    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ChapterRepository chapterRepository;
     // Directory to save uploaded videos
     private static final String VIDEO_UPLOAD_DIR = "uploads/videos/";

     // Ensure the upload directory exists
     static {
         File directory = new File(VIDEO_UPLOAD_DIR);
         if (!directory.exists()) {
             directory.mkdirs();
         }
     }

    // Get all chapters
    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    // Get chapter by ID
    public Optional<Chapter> getChapterById(Long id) {
        return chapterRepository.findById(id);
    }

    // Get chapters by course ID
    public List<Chapter> getChaptersByCourseId(Long courseId) {
        return chapterRepository.findByCourseId(courseId);
    }

    // Create or update a chapter
    public Chapter saveChapter(Chapter chapter) {
        return chapterRepository.save(chapter);
    }

    // Delete a chapter
    public void deleteChapter(Long id) {
        chapterRepository.deleteById(id);
    }
    // Save video to folder and associate with a chapter
    public Video saveVideo(MultipartFile file, Long chapterId) throws IOException {
        // Generate file path and save the file
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get(VIDEO_UPLOAD_DIR + fileName);
        Files.copy(file.getInputStream(), filePath);

        // Create a Video object and associate with the chapter
        Video video = new Video();
        video.setTitle(fileName);
        video.setVideoPath(filePath.toString());

        // Find the chapter to associate with the video
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow(() -> new RuntimeException("Chapter not found"));
        video.setChapter(chapter);

        // Save the video to the repository
        return videoRepository.save(video);
    }
}
