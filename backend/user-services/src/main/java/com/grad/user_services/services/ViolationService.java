package com.grad.user_services.services;

import com.grad.user_services.dao.ViolationRepository;
import com.grad.user_services.dto.ViolationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.grad.user_services.model.Violation;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViolationService {

    @Autowired
    private ViolationRepository violationRepository;

    public void saveViolation(ViolationDTO dto) {
        Violation violation = new Violation();
        violation.setStartTime(dto.getStartTime());
        violation.setEndTime(dto.getEndTime());
        violation.setDuration(dto.getDuration());
        violation.setUserId(dto.getUserId());
        violation.setQuizId(dto.getQuizId());
        violation.setViolation(dto.getViolation());
        violation.setCourseId(dto.getCourseId());
        violationRepository.save(violation);
    }

    public List<ViolationDTO> getAllViolations() {
        return violationRepository.findAll().stream().map(v -> {
            ViolationDTO dto = new ViolationDTO();
            dto.setStartTime(v.getStartTime());
            dto.setEndTime(v.getEndTime());
            dto.setDuration(v.getDuration());
            dto.setUserId(v.getUserId());
            dto.setQuizId(v.getQuizId());
            dto.setViolation(v.getViolation());
            dto.setCourseId(v.getCourseId());
            return dto;
        }).collect(Collectors.toList());
    }


    public List<Violation> getViolationsByUserAndCourse(Long userId, Long courseId) {
        return violationRepository.findByUserIdAndCourseId(userId, courseId);
    }
}
