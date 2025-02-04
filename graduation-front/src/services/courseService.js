const API_BASE_URL = "http://localhost:8087/api";

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: "PUT",
      body: courseData,
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error updating course:", error);
    return null;
  }
};

// Upload file (image or video)
export const uploadFile = async (file, url, extraData = {}) => {
  const fileFormData = new FormData();
  fileFormData.append("file", file);
  Object.keys(extraData).forEach((key) => fileFormData.append(key, extraData[key]));

  try {
    const response = await fetch(url, {
      method: "POST",
      body: fileFormData,
    });
    return response.ok;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};
