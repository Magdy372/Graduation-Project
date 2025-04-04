package com.grad.course_management_services.clients;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

import com.grad.course_management_services.dto.SummarizationResponse;

@FeignClient(name = "summarization-service", url = "http://localhost:8090") //to interact with the course service
public interface SummarizationServiceClient {
    
    @PostMapping("/summarize")
    SummarizationResponse summarizeVideo(@RequestBody Map<String, String> request);
}

