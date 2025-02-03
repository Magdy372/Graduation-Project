package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Category;
import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.models.User;

import jakarta.transaction.Transactional;

import com.grad.course_management_services.clients.UserServiceClient;
import com.grad.course_management_services.dao.CategoryRepository;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dao.CourseRepository;
import com.grad.course_management_services.dto.CourseRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

 private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final ChapterRepository chapterRepository;
    @Autowired
    private FileStorageService fileStorageService;

    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository, ChapterRepository chapterRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.chapterRepository = chapterRepository;
    }
    @Autowired

    private UserServiceClient userServiceClient; // Feign client to fetch user data

    @Transactional
public Course saveCourseDto(CourseRequestDTO requestDTO, MultipartFile image) throws IOException {
    // Check if category name is null or empty
    String categoryName = requestDTO.getCategoryName();
    if (categoryName == null || categoryName.trim().isEmpty()) {
        throw new IllegalArgumentException("Category name cannot be null or empty");
    }

    System.out.println("category name = " + categoryName);

    // Save the uploaded image and get its URL
    String imageUrl = fileStorageService.storeFile(image);

    // Find or create the category
    Category category = categoryRepository.findByName(categoryName)
        .orElseGet(() -> categoryRepository.save(new Category(null, categoryName)));

    // Create the course
    Course course = new Course();
    course.setName(requestDTO.getName());
    course.setDescription(requestDTO.getDescription());
    course.setImageUrl(imageUrl); // Set the image URL
    course.setCategory(category); // Associate course with category

    // Save course first to get an ID
    course = courseRepository.save(course);

    // Create chapters (without videos)
    List<Chapter> chapters = new ArrayList<>();
    if (requestDTO.getChapterTitles() != null) {
        for (String title : requestDTO.getChapterTitles()) {
            Chapter chapter = new Chapter();
            chapter.setTitle(title);
            chapter.setCourse(course); // Associate chapter with course
            chapters.add(chapter);
        }
        chapterRepository.saveAll(chapters);
    }

    return course;
}
    
    
    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // Create or update a course
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Delete a course
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // Get courses by category ID (example of custom query method)
    public List<Course> getCoursesByCategoryId(Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }
}
