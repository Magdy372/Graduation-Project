// Define the base URL for the API
const BASE_URL = "http://localhost:8089";

// Register User Service
export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/with-documents`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, errors: errorData };
    }

    const responseData = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error in registration:", error);
    return { success: false, errors: error };
  }
};

// File Upload Service
export const uploadFiles = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/upload-pdfs`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, errors: errorData };
    }

    const responseData = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error in file upload:", error);
    return { success: false, errors: error };
  }
};
