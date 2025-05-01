package com.grad.user_services.services;

import com.grad.user_services.dao.ViolationRepository;
import com.grad.user_services.dto.ViolationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.grad.user_services.model.Violation;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViolationService {

    @Autowired
    private ViolationRepository violationRepository;

    public void saveViolation(ViolationDTO dto) {
        Violation violation = new Violation();
        violation.setTimestamp(dto.getTimestamp());
        violation.setUserId(dto.getUserId());
        violation.setQuizId(dto.getQuizId());
        violation.setViolation(dto.getViolation());
        violationRepository.save(violation);
    }

    public List<ViolationDTO> getAllViolations() {
        return violationRepository.findAll().stream().map(v -> {
            ViolationDTO dto = new ViolationDTO();
            dto.setTimestamp(v.getTimestamp());
            dto.setUserId(v.getUserId());
            dto.setQuizId(v.getQuizId());
            dto.setViolation(v.getViolation());
            return dto;
        }).collect(Collectors.toList());
    }
}
