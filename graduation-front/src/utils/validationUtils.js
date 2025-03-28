export const validateLoginForm = (email, password) => {
  const errors = {
    email: '',
    password: '',
    general: ''
  };

  // Email validation
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email should be valid';
  }

  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  // } else if (password.length < 8) {
  //   errors.password = 'Password must be at least 8 characters';
  }

  return errors;
};

export const validateRegisterEmail = async (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, message: 'Email should be valid' };
  }

  try {
    const response = await fetch(`http://localhost:8084/users/check-email?email=${email}`);
    if (!response.ok) {
      throw new Error('Failed to check email availability');
    }
    
    const data = await response.json();
    return {
      isValid: !data.exists,
      message: data.exists ? 'This email is already registered. Please use a different email.' : ''
    };
  } catch (error) {
    console.error('Error checking email:', error);
    return { isValid: false, message: 'Failed to check email availability. Please try again.' };
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}; 