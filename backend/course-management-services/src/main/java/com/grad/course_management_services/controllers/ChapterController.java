package com.grad.course_management_services.controllers;

import com.grad.course_management_services.dao.VideoRepository;
import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Video;
import com.grad.course_management_services.services.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ChapterController {

    @Autowired
    private ChapterService chapterService;
    @Autowired
    private VideoRepository videoRepository;

    // Get all chapters
    @GetMapping("/chapters")
    public ResponseEntity<List<Chapter>> getAllChapters() {
        List<Chapter> chapters = chapterService.getAllChapters();
        return ResponseEntity.ok(chapters);
    }

    // Get chapter by ID
    @GetMapping("/chapters/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable Long id) {
        Optional<Chapter> chapter = chapterService.getChapterById(id);
        return chapter.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get all chapters for a specific course
    @GetMapping("/courses/{courseId}/chapters")
    public ResponseEntity<List<Chapter>> getChaptersByCourse(@PathVariable Long courseId) {
        List<Chapter> chapters = chapterService.getChaptersByCourseId(courseId);

        for (Chapter chapter : chapters) {
            chapter.setVideos(videoRepository.findByChapterId(chapter.getId())); // Ensure videos are included
        }

        return ResponseEntity.ok(chapters);
    }

    // Create a new chapter for a specific course
    @PostMapping("/chapters/courses/{courseId}")
    public ResponseEntity<Chapter> createChapter(@PathVariable Long courseId, @RequestBody Chapter chapter) {
        return ResponseEntity.ok(chapterService.createChapter(courseId, chapter));
    }

    // Update a chapter
    @PutMapping("/chapters/{id}")
    public ResponseEntity<Chapter> updateChapter(@PathVariable Long id, @RequestBody Chapter updatedChapter) {
        Chapter chapter = chapterService.updateChapter(id, updatedChapter);
        if (chapter != null) {
            return ResponseEntity.ok(chapter);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Delete a Chapter
    @DeleteMapping("/chapters/{chapterId}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long chapterId) {
        chapterService.deleteChapter(chapterId);
        return ResponseEntity.noContent().build();
    }
}
