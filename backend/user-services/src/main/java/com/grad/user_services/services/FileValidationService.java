package com.grad.user_services.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileValidationService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    /**
     * Validates a file to ensure it meets the requirements
     * @param file The file to validate
     * @param fieldName The name of the field for error messages
     * @throws IllegalArgumentException if validation fails
     */
    public void validateFile(MultipartFile file, String fieldName) {
        if (file != null && !file.isEmpty()) {
            validateFileType(file, fieldName);
            validateFileSize(file, fieldName);
        }
    }

    private void validateFileType(MultipartFile file, String fieldName) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException(
                String.format("Only PDF files are allowed for %s", fieldName)
            );
        }
    }

    private void validateFileSize(MultipartFile file, String fieldName) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                String.format("File size must not exceed 5MB for %s", fieldName)
            );
        }
    }
} 