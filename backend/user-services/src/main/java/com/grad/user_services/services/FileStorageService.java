package com.grad.user_services.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads");

    // Initialize the storage directory
    public void init() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    // Store a file in the uploads directory
    public String store(MultipartFile file) {
        try {
            // Ensure the uploads directory exists
            init();

            // Check if the file is empty
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            // Generate a unique file name
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Resolve the file path and copy the file
            Path destinationFile = rootLocation.resolve(Paths.get(fileName)).normalize().toAbsolutePath();
            Files.copy(file.getInputStream(), destinationFile);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}