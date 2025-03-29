/**
 * Utility functions for file validation
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Validates a file to ensure it meets the requirements
 * @param {File} file - The file to validate
 * @param {string} fieldName - The name of the field for error messages
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateFile = (file, fieldName) => {
    if (!file) {
        return { isValid: true, error: null };
    }

    // Check file type
    if (!file.type || file.type !== 'application/pdf') {
        return {
            isValid: false,
            error: `Only PDF files are allowed for ${fieldName}`
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: `File size must not exceed 5MB for ${fieldName}`
        };
    }

    return { isValid: true, error: null };
}; 