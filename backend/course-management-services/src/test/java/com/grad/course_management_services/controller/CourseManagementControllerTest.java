package com.grad.course_management_services.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grad.course_management_services.dto.CourseRequestDTO;
import com.grad.course_management_services.models.Course;
import com.grad.course_management_services.services.CourseService;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;

import com.grad.course_management_services.dao.CourseRepository;

import org.springframework.test.annotation.Rollback;

@SpringBootTest
@AutoConfigureMockMvc
@Rollback(false)  // Ensure that DB changes are rolled back after the test
public class CourseManagementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CourseService courseService;

    @Test
    public void testSaveCourse() throws Exception {
        // Create a mock image file to simulate the file upload
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "Test Image Content".getBytes()
        );
    
        // Create the request DTO
        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("test course");
        requestDTO.setDescription("test desc course");
        requestDTO.setCategoryName("category name");
        requestDTO.setChapterTitles(List.of("chapter title"));
        requestDTO.setImageUrl("path/to/image/url");
        
        // Serialize the DTO to JSON for the request body
        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);
    
        // Create a mock multipart file for the request body
        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );
    
        // Perform the POST request to create the course
        mockMvc.perform(multipart("/api/courses")
                .file(image)  // Add the image file to the request
                .file(requestDTOFile)  // Add the DTO as a JSON file
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())  // Expect a Created status
                .andExpect(jsonPath("$.name").value("test course"));  // Verify the name of the created course
    }
    

    @Test
    public void testCreateCourseWithoutName() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "Test Image Content".getBytes()
        );

        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("");
        requestDTO.setDescription("test desc course");
        requestDTO.setCategoryName("category name");
        requestDTO.setChapterTitles(List.of("chapter title"));
        requestDTO.setImageUrl("path/to/image/url");

        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);

        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );

        mockMvc.perform(multipart("/api/courses")
                .file(image)
                .file(requestDTOFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Course name is required"));
                
    }

    @Test
    public void testCreateCourseWithoutDesc() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "Test Image Content".getBytes()
        );

        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("Test course name");
        requestDTO.setDescription("");
        requestDTO.setCategoryName("category name");
        requestDTO.setChapterTitles(List.of("chapter title"));
        requestDTO.setImageUrl("path/to/image/url");

        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);

        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );

        mockMvc.perform(multipart("/api/courses")
                .file(image)
                .file(requestDTOFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.description").value("Course description is required"));
                
    }

    @Test
    public void testCreateCourseWithoutCategory() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "Test Image Content".getBytes()
        );

        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("Test course name");
        requestDTO.setDescription("test course Description");
        requestDTO.setCategoryName("");
        requestDTO.setChapterTitles(List.of("chapter title"));
        requestDTO.setImageUrl("path/to/image/url");

        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);

        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );

        mockMvc.perform(multipart("/api/courses")
                .file(image)
                .file(requestDTOFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Category name cannot be empty"));
                
    }

    @Test
    public void testCreateCourseWithoutImage() throws Exception {
        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("test course");
        requestDTO.setDescription("test desc course");
        requestDTO.setCategoryName("category name");
        requestDTO.setChapterTitles(List.of("chapter title"));
        requestDTO.setImageUrl("");  // Empty image URL
    
        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);
    
        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );
    
        mockMvc.perform(multipart("/api/courses")
        .file(requestDTOFile)
        .contentType(MediaType.MULTIPART_FORM_DATA))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error").value("Course image is required")); 

    }

    @Test
    public void testCreateCourseWithoutChapter() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "Test Image Content".getBytes()
        );

        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("Test course name");
        requestDTO.setDescription("test course Description");
        requestDTO.setCategoryName("course category");
        requestDTO.setChapterTitles(List.of(""));
        requestDTO.setImageUrl("path/to/image/url");

        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);

        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );

        mockMvc.perform(multipart("/api/courses")
                .file(image)
                .file(requestDTOFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("At least one chapter title is required"));
                
    }


    @Test
    public void testCreateCourseWithMissingFields() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
            "image",
            "test.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "Test Image Content".getBytes()
        );

        CourseRequestDTO requestDTO = new CourseRequestDTO();
        requestDTO.setName("");
        requestDTO.setDescription("");
        requestDTO.setCategoryName("category name");
        requestDTO.setChapterTitles(List.of("chapter title"));
        requestDTO.setImageUrl("path/to/image/url");

        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(requestDTO);

        MockMultipartFile requestDTOFile = new MockMultipartFile(
            "requestDTO",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            requestJson.getBytes()
        );

        mockMvc.perform(multipart("/api/courses")
                .file(image)
                .file(requestDTOFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Course name is required"))
                .andExpect(jsonPath("$.description").value("Course description is required"));

                
    }

    
    
}
