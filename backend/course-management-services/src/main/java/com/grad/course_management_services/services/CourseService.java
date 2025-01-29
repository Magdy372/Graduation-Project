package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.models.User;
import com.grad.course_management_services.clients.UserServiceClient;
import com.grad.course_management_services.dao.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired

    private UserServiceClient userServiceClient; // Feign client to fetch user data

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
