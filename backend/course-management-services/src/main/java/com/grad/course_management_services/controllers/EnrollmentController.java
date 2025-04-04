package com.grad.course_management_services.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

import com.grad.course_management_services.clients.UserServiceClient;
import com.grad.course_management_services.dto.UserDTO;
import com.grad.course_management_services.models.Enrollment;
import com.grad.course_management_services.services.EnrollmentService;

import feign.FeignException;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/enroll")
    // Enroll user in a specific course
    public ResponseEntity<?> enrollUser(@RequestParam Long userId, @RequestParam Long courseId) {
        try {
            // Fetch user details from UserService using UserDTO
            UserDTO userDTO = userServiceClient.getUserById(userId);

            // If the user is found, proceed with enrollment logic
            Enrollment enrollment = enrollmentService.enrollUserInCourse(userDTO.getId(), courseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);

        } catch (FeignException.NotFound ex) {
            // Handle the case where the user does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User with ID " + userId + " not found"));
        } catch (IllegalStateException ex) {
            // Handle the case where user is already enrolled
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            // Handle other potential exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during enrollment: " + ex.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    // Get all enrollments for a specific user
    public ResponseEntity<?> getUserEnrollments(@PathVariable Long userId) {
        try {
            // Fetch all enrollments for the given user ID
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUser(userId);

            if (enrollments.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No enrollments found for user ID " + userId);
            }

            return ResponseEntity.ok(enrollments);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching enrollments: " + ex.getMessage());
        }
    }

}
