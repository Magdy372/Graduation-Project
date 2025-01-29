package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.dao.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;

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
}
