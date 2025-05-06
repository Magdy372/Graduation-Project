package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Category;
import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.models.User;
import com.grad.course_management_services.models.Video;

import jakarta.transaction.Transactional;import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.grad.course_management_services.clients.UserServiceClient;
import com.grad.course_management_services.dao.CategoryRepository;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dao.CourseRepository;
import com.grad.course_management_services.dto.ChapterDTO;
import com.grad.course_management_services.dto.CourseDTO;
import com.grad.course_management_services.dto.CourseRequestDTO;
import com.grad.course_management_services.dto.VideoDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

 private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final ChapterRepository chapterRepository;
    @Autowired
    private FileStorageService fileStorageService;
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    //Constructor injection for repositories
    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository, ChapterRepository chapterRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.chapterRepository = chapterRepository;
    }
    @Autowired

    private UserServiceClient userServiceClient; // Feign client to fetch user data

    @Transactional
   

    // Save course with image and category
    public Course saveCourseDto(CourseRequestDTO requestDTO, MultipartFile image) throws IOException {
        // Check if category name is null or empty
        String categoryName = requestDTO.getCategoryName();
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }

        System.out.println("category name = " + categoryName);

        // String courseName = requestDTO.getName();
        // if (courseName == null || courseName.trim().isEmpty()) {
        //     throw new IllegalArgumentException("Course name is required");
        // }

        // String courseDesc = requestDTO.getDescription();
        // if (courseDesc == null || courseDesc.trim().isEmpty()) {
        //     throw new IllegalArgumentException("Course description is required");
        // }


        List<String> chapterTitles = requestDTO.getChapterTitles();
        if (chapterTitles == null || chapterTitles.isEmpty() || chapterTitles.contains("")) {
            throw new IllegalArgumentException("At least one chapter title is required");
        }

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Course image is required");
        }
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
    

// Fetch course details including chapters and videos by ID
  
 public CourseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.getImageUrl(),
                course.getCategory() != null ? course.getCategory().getName() : null,
                course.getChapters().stream().map(chapter -> new ChapterDTO(
                        chapter.getId(),
                        chapter.getTitle(),
                        chapter.getVideos().stream().map(video -> new VideoDTO(
                                video.getId(),
                                video.getTitle(),
                                video.getVideoPath(),
                                video.getVideoSummary(),
                                video.getGeminiSummary()
                        )).collect(Collectors.toList())
                )).collect(Collectors.toList())
        );
    }

    // Fetch all courses with chapters and videos
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(course -> new CourseDTO(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.getImageUrl(),
                course.getCategory() != null ? course.getCategory().getName() : null,
                course.getChapters().stream().map(chapter -> new ChapterDTO(
                        chapter.getId(),
                        chapter.getTitle(),
                        chapter.getVideos().stream().map(video -> new VideoDTO(
                                video.getId(),
                                video.getTitle(),
                                video.getVideoPath(),
                                video.getVideoSummary(),
                                video.getGeminiSummary()
                        )).collect(Collectors.toList())
                )).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }

    // Create or updatea course
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Delete a course
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // Get courses by category ID 
    public List<Course> getCoursesByCategoryId(Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }
    @Transactional
    public CourseDTO updateCourseDto(Long courseId, CourseDTO requestDTO, MultipartFile image) throws IOException {
        // Fetch the existing course
        final Course courseRef = courseRepository.findById(courseId) // Store in final reference
                .orElseThrow(() -> new RuntimeException("Course not found"));
    
        // Update basic course details
        courseRef.setName(requestDTO.getName());
        courseRef.setDescription(requestDTO.getDescription());
    
        // Update course image if provided
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            courseRef.setImageUrl(imageUrl);
        }
    
        // Update category if provided
        if (requestDTO.getCategoryName() != null && !requestDTO.getCategoryName().trim().isEmpty()) {
            Category category = categoryRepository.findByName(requestDTO.getCategoryName())
                    .orElseGet(() -> categoryRepository.save(new Category(null, requestDTO.getCategoryName())));
            courseRef.setCategory(category);
        }
    
        // Save and return updated course as DTO
        Course savedCourse = courseRepository.save(courseRef);
        return convertToDto(savedCourse);
    }
    
    // Convert Course to DTO without chapters/videos
    private CourseDTO convertToDto(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.getImageUrl(),
                course.getCategory() != null ? course.getCategory().getName() : null,
                new ArrayList<>() // No chapters/videos
        );
    }
    
        
}
