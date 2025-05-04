package com.grad.user_services.controller;

import com.grad.user_services.dto.ViolationDTO;
import com.grad.user_services.model.Violation;
import com.grad.user_services.services.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
public class ViolationController {

    @Autowired
    private ViolationService violationService;
 

    @PostMapping
    public ResponseEntity<String> logViolation(@RequestBody ViolationDTO violationDTO) {
        violationService.saveViolation(violationDTO);
        return ResponseEntity.ok("Violation saved");
    }

    @GetMapping
    public ResponseEntity<List<ViolationDTO>> getAllViolations() {
        return ResponseEntity.ok(violationService.getAllViolations());
    }
      @GetMapping("/foruser")
    public ResponseEntity<List<Violation>> getViolationsByUserAndCourse(
            @RequestParam Long userId,
            @RequestParam Long courseId) {

        List<Violation> violations = violationService.getViolationsByUserAndCourse(userId, courseId);
        return ResponseEntity.ok(violations);
    }
}
