package com.grad.course_management_services.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    private String categoryName; 
    private List<String> chapterTitles; 
}
