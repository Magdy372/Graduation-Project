package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dao.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;

    // ✅ Get all chapters
    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    // ✅ Get chapter by ID
    public Optional<Chapter> getChapterById(Long id) {
        return chapterRepository.findById(id);
    }
    

    // ✅ Get all chapters by course ID
    public List<Chapter> getChaptersByCourseId(Long courseId) {
        return chapterRepository.findByCourseId(courseId);
    }

    // ✅ Create a new chapter for a course
    public Chapter createChapter(Long courseId, Chapter chapter) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            chapter.setCourse(courseOptional.get());
            return chapterRepository.save(chapter);
        } else {
            throw new RuntimeException("Course not found with ID: " + courseId);
        }
    }

    // ✅ Update an existing chapter
    public Chapter updateChapter(Long id, Chapter updatedChapter) {
        Optional<Chapter> existingChapterOpt = chapterRepository.findById(id);
        if (existingChapterOpt.isPresent()) {
            Chapter existingChapter = existingChapterOpt.get();
            existingChapter.setTitle(updatedChapter.getTitle());
           
            return chapterRepository.save(existingChapter);
        }
        return null;
    }

    // ✅ Delete a chapter
    public boolean deleteChapter(Long id) {
        if (chapterRepository.existsById(id)) {
            chapterRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
