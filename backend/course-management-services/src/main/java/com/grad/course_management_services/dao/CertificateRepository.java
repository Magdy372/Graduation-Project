package com.grad.course_management_services.dao;

import com.grad.course_management_services.models.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    // Find certificate by user ID and course ID
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
    
    // Find all certificates for a user
    List<Certificate> findByUserId(Long userId);
    
    // Find all certificates for a course
    List<Certificate> findByCourseId(Long courseId);
    
    // Find by certificate number
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    // Check if a certificate exists for a user and course
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
} 