package com.grad.course_management_services.controllers;

import com.grad.course_management_services.dto.CourseRequestDTO;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Get all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // Get course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get courses by category ID
    @GetMapping("/category/{categoryId}")
    public List<Course> getCoursesByCategoryId(@PathVariable Long categoryId) {
        return courseService.getCoursesByCategoryId(categoryId);
    }

    // Create or update course
    // @PostMapping
    // public ResponseEntity<Course> createOrUpdateCourse(@RequestBody Course course) {
    //     Course savedCourse = courseService.saveCourse(course);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    // }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Course> saveCourse(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart("requestDTO") CourseRequestDTO requestDTO) throws IOException {
    
        Course savedCourse = courseService.saveCourseDto(requestDTO, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }
    
    // Delete course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
