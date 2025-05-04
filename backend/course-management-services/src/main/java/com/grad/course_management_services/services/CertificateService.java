package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Certificate;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.models.QuizAttempt;
import com.grad.course_management_services.clients.UserServiceClient;
import com.grad.course_management_services.clients.ViolationClient;
import com.grad.course_management_services.dao.CertificateRepository;
import com.grad.course_management_services.dao.CourseRepository;
import com.grad.course_management_services.dto.QuizAttemptResponseDTO;
import com.grad.course_management_services.dto.UserDTO;
import com.grad.course_management_services.dto.ViolationDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;
    @Autowired
    private EmailService emailService;

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private ViolationClient violationClient;

    @Autowired
    private UserServiceClient userServiceClient;
    // Generate and save a new certificate
    public Certificate generateCertificate(Long userId, Long courseId, Double finalScore) {
        // Check if certificate already exists
        if (certificateRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new IllegalStateException("Certificate already exists for this user and course");
        }

        Certificate certificate = new Certificate();
        certificate.setUserId(userId);
        certificate.setCourseId(courseId);
        certificate.setIssueDate(LocalDateTime.now());
        certificate.setCertificateNumber(generateCertificateNumber());
        certificate.setFinalScore(finalScore);
        certificate.setPassed(finalScore >= 50.0); // Pass threshold is 50%
     

        return certificateRepository.save(certificate);
    }

    // Generate unique certificate number
    private String generateCertificateNumber() {
        return "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Get certificate by ID
    public Certificate getCertificateById(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
    }
    // Get all certificates with status "PENDING"

public List<Certificate> getPendingCertificates() {
    return certificateRepository.findPendingCertificates();
}

    // Get certificate by user and course
    public Certificate getCertificateByUserAndCourse(Long userId, Long courseId) {
        return certificateRepository.findByUserIdAndCourseId(userId, courseId)
                .orElse(null);
    }

    // Get all certificates for a user
    public List<Certificate> getCertificatesByUser(Long userId) {
        return certificateRepository.findByUserId(userId);
    }

    // Get all certificates for a course
    public List<Certificate> getCertificatesByCourse(Long courseId) {
        return certificateRepository.findByCourseId(courseId);
    }

    // Get certificate by certificate number
    public Certificate getCertificateByCertificateNumber(String certificateNumber) {
        return certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
    }

    // Get all certificates
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    // Delete certificate
    public void deleteCertificate(Long id) {
        certificateRepository.deleteById(id);
    }
     // Change Status certificate
    public ResponseEntity<?> changeCertificateStatus(Long certificateId, String newStatus) {
    Optional<Certificate> certificateOpt = certificateRepository.findById(certificateId);

    if (certificateOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("Certificate not found");
    }

    Certificate certificate = certificateOpt.get();

    newStatus = newStatus.replaceAll("\\n", "").trim();
    certificate.setStatus(newStatus);
    Certificate updatedCertificate = certificateRepository.save(certificate);


    if ("ACCEPTED".equalsIgnoreCase(newStatus)) {
        try {
            Long userId = certificate.getUserId();
            UserDTO userDTO = userServiceClient.getUserById(userId);

            Long courseId = certificate.getCourseId();
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

            emailService.sendCertificateEmail(
                userDTO.getEmail(),
                userDTO.getFirstname() + " " + userDTO.getLastname(),
                course.getName(),
                updatedCertificate.getCertificateNumber(),
                updatedCertificate.getFinalScore()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to send email: " + e.getMessage());
        }
    }
       

    return ResponseEntity.ok(updatedCertificate);
}

} 