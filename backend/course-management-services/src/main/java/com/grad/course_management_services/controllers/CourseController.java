package com.grad.course_management_services.controllers;

import com.grad.course_management_services.dto.ChapterDTO;
import com.grad.course_management_services.dto.CourseDTO;
import com.grad.course_management_services.dto.CourseRequestDTO;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.services.CourseService;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/")
public class CourseController {

    @Autowired
    private CourseService courseService;

// Get course by ID
    @GetMapping("courses/{id}")
    public CourseDTO getCourse(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }
// Get all courses
    @GetMapping("courses")
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }
// Update course
    @PutMapping("courses/{courseId}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long courseId,
            @ModelAttribute CourseDTO courseRequestDTO,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        
        CourseDTO updatedCourse = courseService.updateCourseDto(courseId, courseRequestDTO, image);
        return ResponseEntity.ok(updatedCourse);
    }
    
    // Get courses by category ID
    @GetMapping("courses/category/{categoryId}")
    public List<Course> getCoursesByCategoryId(@PathVariable Long categoryId) {
        return courseService.getCoursesByCategoryId(categoryId);
    }

    // Create or update course
    // @PostMapping
    // public ResponseEntity<Course> createOrUpdateCourse(@RequestBody Course course) {
    //     Course savedCourse = courseService.saveCourse(course);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    // }

    @PostMapping("courses")
    @Consumes({MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Course> saveCourse(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @Valid @RequestPart("requestDTO") CourseRequestDTO requestDTO) throws IOException {
        Course savedCourse = courseService.saveCourseDto(requestDTO, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }


    // Delete course
    @DeleteMapping("courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errorMessages = new HashMap<>();
        ex.getConstraintViolations().forEach(violation ->
            errorMessages.put(violation.getPropertyPath().toString(), violation.getMessage()));
        return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
    }
    
    @RestControllerAdvice
    public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}


}
