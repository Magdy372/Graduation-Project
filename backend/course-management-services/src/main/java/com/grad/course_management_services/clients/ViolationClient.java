package com.grad.course_management_services.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.grad.course_management_services.dto.ViolationDTO;
import com.grad.course_management_services.models.Violation;


@FeignClient(name = "user-services", url = "http://localhost:8089")
public interface ViolationClient {
    @GetMapping("/api/violations/foruser") 
    List<ViolationDTO> getViolationsByUserAndCourse(
        @RequestParam("userId") Long userId,
        @RequestParam("courseId") Long courseId
    );
}

