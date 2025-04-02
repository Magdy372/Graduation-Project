/**
 * Validates question data and returns any validation errors
 * @param {Object} questionData - The question data to validate
 * @returns {Object} Object containing validation errors, if any
 */
export const validateQuestion = (questionData) => {
  const errors = {};

  // Validate question type
  if (!questionData.questionType) {
    errors.questionType = 'يرجى اختيار نوع السؤال';
  }

  // Validate question text
  if (!questionData.questionText || questionData.questionText.trim() === '') {
    errors.questionText = 'يرجى إدخال نص السؤال';
  }

  // Validate points
  if (!questionData.points || questionData.points <= 0) {
    errors.points = 'يجب أن تكون النقاط أكبر من صفر';
  }

  // Validate options for MCQ
  if (questionData.questionType === 'MCQ') {
    if (!questionData.options || questionData.options.length < 4) {
      errors.options = 'يجب إضافة 4 خيارات على الأقل';
    }

    // Validate each option
    questionData.options?.forEach((option, index) => {
      if (!option || option.trim() === '') {
        errors[`option${index + 1}`] = 'يرجى إدخال نص الخيار';
      }
    });

    // Validate correct answer for MCQ
    if (!questionData.correctAnswer) {
      errors.correctAnswer = 'يرجى اختيار الإجابة الصحيحة';
    }
  }

  // Validate correct answer for TRUE_FALSE
  if (questionData.questionType === 'TRUE_FALSE' && !questionData.correctAnswer) {
    errors.correctAnswer = 'يرجى اختيار الإجابة الصحيحة';
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