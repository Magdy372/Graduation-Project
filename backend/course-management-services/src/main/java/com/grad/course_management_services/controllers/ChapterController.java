package com.grad.course_management_services.controllers;

import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.services.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    @Autowired
    private ChapterService chapterService;

    // Get all chapters
    @GetMapping
    public List<Chapter> getAllChapters() {
        return chapterService.getAllChapters();
    }

    // Get chapter by ID
    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable Long id) {
        Optional<Chapter> chapter = chapterService.getChapterById(id);
        return chapter.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get chapters by course ID
    @GetMapping("/course/{courseId}")
    public List<Chapter> getChaptersByCourseId(@PathVariable Long courseId) {
        return chapterService.getChaptersByCourseId(courseId);
    }

    // Create or update chapter
    @PostMapping
    public ResponseEntity<Chapter> createOrUpdateChapter(@RequestBody Chapter chapter) {
        Chapter savedChapter = chapterService.saveChapter(chapter);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedChapter);
    }

    // Delete chapter
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
