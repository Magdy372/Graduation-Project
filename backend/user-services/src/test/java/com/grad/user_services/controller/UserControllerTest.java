package com.grad.user_services.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grad.user_services.Exceptions.AuthenticationException;
import com.grad.user_services.auth.AuthenticationResponse;
import com.grad.user_services.auth.AuthenticationService;
import com.grad.user_services.dto.UserDTO;
import com.grad.user_services.dto.UserWithDocumentsDTO;
import com.grad.user_services.model.User;
import com.grad.user_services.model.UserDocument;
import com.grad.user_services.services.UserService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback(false) 
public class UserControllerTest {
    
    @MockBean
    private AuthenticationService authenticationService; 

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    private ObjectMapper objectMapper = new ObjectMapper();
    private User testUser;

    @BeforeEach
    public void setup() {
        objectMapper.findAndRegisterModules();
    
        UserDocument userDocument = new UserDocument(
            "path/to/license.pdf",
            "path/to/profession_license.pdf",
            "path/to/syndicate_card.pdf",
            "path/to/commercial_register.pdf",
            "path/to/tax_card.pdf"
        );
    
        // Just create the user object but don't save it
        testUser = new User("yarab", "yarab", "mnnn@example.com", passwordEncoder.encode("Ranoona123@"));
        testUser.setTitle("دكتور");
        testUser.setGovernorate("القاهرة");
        testUser.setPhonenumber("01004222194");
        testUser.setApproved(true);
        testUser.setUserDocument(userDocument);
    
        // Mock authentication response (if needed for testing authentication)
        AuthenticationResponse mockResponse = new AuthenticationResponse("mock-access-token", "mock-refresh-token");
    
        when(authenticationService.authenticate(any())).thenReturn(mockResponse);
    }
    
    
    @Test
    @WithMockUser // Simulates an authenticated user
    public void testRegisterUser_Success() throws Exception {
        // Save the user using real service
        User savedUser = userService.saveUser(testUser);
    }

    //     // Convert User object to JSON
    //     String requestBody = objectMapper.writeValueAsString(testUser);
    //     System.out.println("Generated JSON: " + requestBody); // Debugging

    //     // Perform POST request and validate response
    //     mockMvc.perform(post("/users/add")
    //             .contentType(MediaType.APPLICATION_JSON)
    //             .content(requestBody))
    //             .andExpect(status().isCreated()) // Expect HTTP 201 Created
    //             .andExpect(jsonPath("$.email", is("aqw@example.com")));

    //     System.out.println("✅ User registered successfully!");
    // }
    
    

    @Test
    public void testRegisterUser_InvalidEmail() throws Exception {
    UserDTO invalidUser = new UserDTO();
    invalidUser.setFirstname("John");
    invalidUser.setLastname("Doe");
    invalidUser.setEmail("invalid-email"); // Invalid email format
    invalidUser.setPassword("ValidPass123@");
    invalidUser.setPhonenumber("01004222194");
    invalidUser.setTitle("Dr.");
    invalidUser.setGovernorate("Cairo");

    String requestBody = objectMapper.writeValueAsString(invalidUser);

    mockMvc.perform(post("/users/add")
    .contentType(MediaType.APPLICATION_JSON)
    .content("{\"email\":\"invalid-email\",\"password\":\"password123\"}"))
    .andExpect(status().isBadRequest())
    .andExpect(jsonPath("$.email").value("Email should be valid")); // Adjust message if needed
    }

    @Test
    public void testRegisterUser_InvalidPassword() throws Exception {
    UserDTO invalidUser = new UserDTO();
    invalidUser.setFirstname("John");
    invalidUser.setLastname("Doe");
    invalidUser.setEmail("john@example.com");
    invalidUser.setPassword("short"); // Too short
    invalidUser.setPhonenumber("01004222194");
    invalidUser.setTitle("Dr.");
    invalidUser.setGovernorate("Cairo");

    String requestBody = objectMapper.writeValueAsString(invalidUser);

    MvcResult result = mockMvc.perform(post("/users/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
            .andExpect(status().isBadRequest()) // Expect 400 Bad Request
            .andReturn();

    System.out.println("Response: " + result.getResponse().getContentAsString());
    }

    

    @Test
    public void testRegisterUser_MissingRequiredFields() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setEmail("john@example.com");
        invalidUser.setPassword("ValidPass123@");
        invalidUser.setPhonenumber("01004222194");

        String requestBody = objectMapper.writeValueAsString(invalidUser);

        mockMvc.perform(post("/users/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest()) // Expect 400 Bad Request
                .andExpect(jsonPath("$.firstname").value("First name is required"))
                .andExpect(jsonPath("$.lastname").value("Last name is required"))
                .andExpect(jsonPath("$.title").value("Title is required"))
                .andExpect(jsonPath("$.governorate").value("Governorate is required"));
    }

    @Test
    public void testRegisterUser_InvalidPhoneNumber() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstname("John");
        invalidUser.setLastname("Doe");
        invalidUser.setEmail("john@example.com");
        invalidUser.setPassword("ValidPass123@");
        invalidUser.setPhonenumber("abc123"); // Invalid phone number
        invalidUser.setTitle("Dr.");
        invalidUser.setGovernorate("Cairo");

        String requestBody = objectMapper.writeValueAsString(invalidUser);

        mockMvc.perform(post("/users/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest()) // Expect 400 Bad Request
                .andExpect(jsonPath("$.phonenumber").value("Phone number must be exactly 11 digits"));
    }


    @Test
    public void testLogin_Success() throws Exception {
        if (userService.getUserByEmail("yarab@example.com").isEmpty()) {
            userService.saveUser(testUser);  
        }
    
        String loginRequest = objectMapper.writeValueAsString(Map.of(
            "email", "yarab@example.com",
            "password", "Ranoona123@" 
        ));
    
        mockMvc.perform(post("/api/v1/auth/authenticate") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isOk())  
                .andExpect(jsonPath("$.accessToken").exists())  
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    public void testLogin_InvalidEmail() throws Exception {
        when(authenticationService.authenticate(any())).thenThrow(new AuthenticationException("Invalid email or password."));
    
        String loginRequest = objectMapper.writeValueAsString(Map.of(
            "email", "invalid@example.com", // Non-existent email
            "password", "Ranoona123@" // Correct password
        ));
    
        mockMvc.perform(post("/api/v1/auth/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isUnauthorized())  // Expect 401 Unauthorized
                .andExpect(jsonPath("$.error").exists()) 
                .andExpect(jsonPath("$.error").value("Invalid email or password")); 
    }
    
    
    

    @Test
    public void testLogin_InvalidPassword() throws Exception {
        when(authenticationService.authenticate(any())).thenThrow(new AuthenticationException("Invalid email or password."));

        // Ensure the user exists first
        if (userService.getUserByEmail("yarab@example.com").isEmpty()) {
            userService.saveUser(testUser);
        }
    
        String loginRequest = objectMapper.writeValueAsString(Map.of(
            "email", "yarab@example.com", // Correct email
            "password", "WrongPassword123@" // Incorrect password
        ));
    
        mockMvc.perform(post("/api/v1/auth/authenticate") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isUnauthorized())  // Expect 401 Unauthorized
                .andExpect(jsonPath("$.error").exists()) 
                .andExpect(jsonPath("$.error").value("Invalid email or password")); 
    }
    
    
}


