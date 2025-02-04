package com.grad.course_management_services.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String categoryName;  // Store category name instead of Category object
      @JsonManagedReference 
    private List<ChapterDTO> chapters;
}
