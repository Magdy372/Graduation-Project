/**
 * Validates admin registration form data
 * @param {Object} formData - The admin registration form data
 * @returns {Object} Object containing validation errors, if any
 */
export const validateAdminRegisterForm = (formData) => {
  const errors = {};

  // First name validation
  if (!formData.firstname || formData.firstname.trim() === '') {
    errors.firstname = 'الاسم الأول مطلوب';
  } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.firstname)) {
    errors.firstname = 'الاسم الأول يجب أن يحتوي على حروف فقط';
  }

  // Last name validation
  if (!formData.lastname || formData.lastname.trim() === '') {
    errors.lastname = 'الاسم الأخير مطلوب';
  } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.lastname)) {
    errors.lastname = 'الاسم الأخير يجب أن يحتوي على حروف فقط';
  }

  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }

  // Password validation
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (formData.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  }

  // Candidate validation
  if (!formData.candidate || formData.candidate.trim() === '') {
    errors.candidate = 'اختيار النقابة مطلوب';
  }

  // Governorate validation
  if (!formData.governorate || formData.governorate.trim() === '') {
    errors.governorate = 'اختيار المحافظة مطلوب';
  }

  return errors;
};