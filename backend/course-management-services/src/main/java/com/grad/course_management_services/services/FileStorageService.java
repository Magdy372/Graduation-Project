package com.grad.course_management_services.services;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // Define the folder where images will be saved
    private final Path rootLocation = Paths.get("uploads/coursesimages");

    public String storeFile(MultipartFile file) throws IOException {
        // Create the uploads/coursesimages directory if it doesn't exist
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }

        // Generate a unique filename to avoid conflicts
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = rootLocation.resolve(filename);

        // Save the file to the uploads/coursesimages folder
        Files.copy(file.getInputStream(), destinationFile);

        // Return the file URL (you can customize this based on your server setup)
        return "/uploads/coursesimages/" + filename;
    }
}