package com.grad.course_management_services.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grad.course_management_services.models.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByCourseId(Long courseId);
}
