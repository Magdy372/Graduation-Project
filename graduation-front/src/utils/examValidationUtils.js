/**
 * Validates exam data and returns any validation errors
 * @param {Object} examData - The exam data to validate
 * @returns {Object} Object containing validation errors, if any
 */
export const validateExam = (examData) => {
  const errors = {};

  // Validate title
  if (!examData.title || examData.title.trim() === '') {
    errors.title = 'يرجى إدخال عنوان الامتحان';
  }

  // Validate chapter selection
  if (!examData.chapterId) {
    errors.chapterId = 'يرجى اختيار الفصل';
  }

  // Validate duration
  if (!examData.duration || examData.duration <= 0) {
    errors.duration = 'يجب أن يكون الوقت المحدد أكبر من صفر';
  }

  // Validate max attempts
  if (!examData.maxAttempts || examData.maxAttempts <= 0) {
    errors.maxAttempts = 'يجب أن يكون عدد المحاولات أكبر من صفر';
  }

  return errors;
};

/**
 * Gets the error message for a specific field
 * @param {Object} errors - The errors object
 * @param {string} field - The field name
 * @returns {string} The error message for the field, if any
 */
export const getFieldError = (errors, field) => {
  return errors[field] || '';
};

/**
 * Checks if a specific field has an error
 * @param {Object} errors - The errors object
 * @param {string} field - The field name
 * @returns {boolean} Whether the field has an error
 */
export const hasError = (errors, field) => {
  return !!errors[field];
};




 
