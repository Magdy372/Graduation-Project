package com.grad.course_management_services.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grad.course_management_services.dao.EnrollmentRepository;
import com.grad.course_management_services.models.Enrollment;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Enrollment enrollUserInCourse(Long userId, Long courseId) {
        // Check if the enrollment already exists
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment.isPresent()) {
            throw new IllegalStateException("User already enrolled in this course");
        }
        
        // Create a new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
}

