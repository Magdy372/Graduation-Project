package com.grad.course_management_services.controllers;

import com.grad.course_management_services.models.Certificate;
import com.grad.course_management_services.services.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

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