package com.grad.course_management_services.controllers;

import com.grad.course_management_services.models.Certificate;
import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.models.Quiz;
import com.grad.course_management_services.models.QuizAttempt;
import com.grad.course_management_services.services.CertificateService;
import com.grad.course_management_services.dao.QuizRepository;
import com.grad.course_management_services.dto.UserDTO;
import com.grad.course_management_services.clients.UserServiceClient;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.repositories.QuizAttemptRepository;
import com.grad.course_management_services.dao.CourseRepository;
import com.grad.course_management_services.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.grad.course_management_services.dto.UserDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;


    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EmailService EmailService;

    @Autowired
    private UserServiceClient userServiceClient;

    @PostMapping("/request")
    public ResponseEntity<?> requestCertificate(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            String userId1 = request.get("userId").toString();
            Long courseId = Long.parseLong(request.get("courseId").toString());
    
            // 1. Check if certificate already exists
            Certificate existingCertificate = certificateService.getCertificateByUserAndCourse(userId, courseId);
            if (existingCertificate != null) {
                return ResponseEntity.ok(Map.of(
                    "status", "exists",
                    "message", "Certificate already exists for this course",
                    "certificate", existingCertificate
                ));
            }
    
            // 2. Get chapters for the course
            List<Chapter> chapters = chapterRepository.findByCourseId(courseId);
            if (chapters.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "No chapters found for this course"
                ));
            }
    
            // 3. Check all quizzes in the chapters have been attempted and passed (score >= 50)
            double totalScore = 0.0;
            int quizCount = 0;
    
            for (Chapter chapter : chapters) {
                Quiz quiz = chapter.getQuiz();  // Access the quiz directly
                if (quiz != null) {
                    Optional<QuizAttempt> bestAttemptOpt = quizAttemptRepository
                        .findTopByUserIdAndQuizIdOrderByScoreDesc(userId1, quiz.getId());
    
                    if (bestAttemptOpt.isEmpty()) {
                        return ResponseEntity.badRequest().body(Map.of(
                            "message", "Quiz not attempted: " + quiz.getTitle(),
                            "quizId", quiz.getId()
                        ));
                    }
    
                    QuizAttempt bestAttempt = bestAttemptOpt.get();
                    if (bestAttempt.getScore() < 50.0) {
                        return ResponseEntity.badRequest().body(Map.of(
                            "message", "Quiz not passed: " + quiz.getTitle(),
                            "quizId", quiz.getId(),
                            "score", bestAttempt.getScore(),
                            "required", 50.0
                        ));
                    }
    
                    totalScore += bestAttempt.getScore();
                    quizCount++;
                }
            }
    
            if (quizCount == 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "No quizzes found for this course"
                ));
            }
    
            // 4. Calculate final average score
            double finalScore = quizCount > 0 ? totalScore / quizCount : 0.0;
            if (finalScore < 50.0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Final score does not meet minimum requirement",
                    "required", 50.0,
                    "achieved", finalScore
                ));
            }
    
            // 5. Generate certificate
            Certificate newCertificate = certificateService.generateCertificate(userId, courseId, finalScore);

            // 6. Send certificate email
            UserDTO userDTO = userServiceClient.getUserById(userId);
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
            
            EmailService.sendCertificateEmail(
                userDTO.getEmail(),
                userDTO.getFirstname()+" "+userDTO.getLastname(),
                course.getName(),
                newCertificate.getCertificateNumber(),
                finalScore
            );

            return ResponseEntity.ok(Map.of(
                "status", "generated",
                "message", "Certificate generated successfully",
                "certificate", newCertificate
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid request parameters"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error processing certificate request: " + e.getMessage()));
        }
    }
    
    // Generate new certificate
    @PostMapping("/generate")
    public ResponseEntity<Certificate> generateCertificate(
            @RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            Long courseId = Long.parseLong(request.get("courseId").toString());
            Double finalScore = Double.parseDouble(request.get("finalScore").toString());

            Certificate certificate = certificateService.generateCertificate(userId, courseId, finalScore);
            return ResponseEntity.ok(certificate);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get certificate by ID
    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificate(@PathVariable Long id) {
        try {
            Certificate certificate = certificateService.getCertificateById(id);
            return ResponseEntity.ok(certificate);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get certificate by user and course
    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<Certificate> getCertificateByUserAndCourse(
            @PathVariable Long userId,
            @PathVariable Long courseId) {
        Certificate certificate = certificateService.getCertificateByUserAndCourse(userId, courseId);
        return certificate != null ? ResponseEntity.ok(certificate) : ResponseEntity.notFound().build();
    }

    // Get all certificates for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getCertificatesByUser(@PathVariable Long userId) {
        List<Certificate> certificates = certificateService.getCertificatesByUser(userId);
        return ResponseEntity.ok(certificates);
    }

    // Get all certificates for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Certificate>> getCertificatesByCourse(@PathVariable Long courseId) {
        List<Certificate> certificates = certificateService.getCertificatesByCourse(courseId);
        return ResponseEntity.ok(certificates);
    }

    // Get certificate by certificate number
    @GetMapping("/number/{certificateNumber}")
    public ResponseEntity<Certificate> getCertificateByCertificateNumber(
            @PathVariable String certificateNumber) {
        try {
            Certificate certificate = certificateService.getCertificateByCertificateNumber(certificateNumber);
            return ResponseEntity.ok(certificate);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all certificates
    @GetMapping
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        List<Certificate> certificates = certificateService.getAllCertificates();
        return ResponseEntity.ok(certificates);
    }

    // Delete certificate
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        try {
            certificateService.deleteCertificate(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 