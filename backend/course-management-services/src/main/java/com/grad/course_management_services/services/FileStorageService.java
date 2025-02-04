package com.grad.course_management_services.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads/videos");
    private final Path rootLocationImages = Paths.get("uploads/coursesimages");

    public String storeFile(MultipartFile file) throws IOException {
        if (!Files.exists(rootLocationImages)) {
            Files.createDirectories(rootLocationImages);
        }
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = rootLocationImages.resolve(filename);
        Files.copy(file.getInputStream(), destinationFile);
        return "/uploads/coursesimages/" + filename;
    }

    public String storeVideo(MultipartFile file) throws IOException {
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = rootLocation.resolve(filename);
        Files.copy(file.getInputStream(), destinationFile);
        return "/uploads/videos/" + filename;
    }

    // ✅ Delete video file
    public boolean deleteVideoFile(String filename) {
        try {
            Path filePath = rootLocation.resolve(filename);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
