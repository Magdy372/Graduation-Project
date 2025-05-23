package com.grad.course_management_services.clients;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.grad.course_management_services.dto.UserDTO;
import com.grad.course_management_services.models.User;
import java.util.List;

@FeignClient(name = "user-services", url = "http://localhost:8089")  //to make the user services communicate with the course services
    public interface UserServiceClient {

    @GetMapping("/users/{userId}")
    UserDTO getUserById(@PathVariable Long userId);
}



