/**
 * Utility functions for file validation
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const ALLOWED_FILE_TYPES = {
  pdf: 'application/pdf',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png'
};

const FILE_TYPE_MESSAGES = {
  pdf: 'PDF',
  jpeg: 'JPEG image',
  jpg: 'JPG image',
  png: 'PNG image'
};

/**
 * Validates a file to ensure it meets the requirements
 * @param {File} file - The file to validate
 * @param {string} fieldName - The name of the field for error messages
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateFile = (file, fieldName) => {
  // Check if file is required but not provided
  if (!file) {
    return {
      isValid: false,
      error: `Please select a file for ${fieldName}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `${fieldName} file size should be less than 10MB`
    };
  }

  // Check file type
  const isValidType = Object.values(ALLOWED_FILE_TYPES).includes(file.type);
  if (!isValidType) {
    const allowedTypes = Object.values(FILE_TYPE_MESSAGES).join(', ');
    return {
      isValid: false,
      error: `${fieldName} must be one of the following types: ${allowedTypes}`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const getFileTypeFromMimeType = (mimeType) => {
  const entry = Object.entries(ALLOWED_FILE_TYPES).find(([_, value]) => value === mimeType);
  return entry ? entry[0] : null;
};

export const isImageFile = (file) => {
  return file && (
    file.type === ALLOWED_FILE_TYPES.jpeg ||
    file.type === ALLOWED_FILE_TYPES.jpg ||
    file.type === ALLOWED_FILE_TYPES.png
  );
};

export const isPdfFile = (file) => {
  return file && file.type === ALLOWED_FILE_TYPES.pdf;
};

export const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

export const generateThumbnail = async (file) => {
  if (!isImageFile(file)) {
    return null;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}; 