import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state.course;

  const [courseName, setCourseName] = useState(course.name);
  const [courseDescription, setCourseDescription] = useState(course.description);
  const [courseCategory, setCourseCategory] = useState(course.categoryName);
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(`http://localhost:8084${course.imageUrl}`);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8084/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCourseImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", courseName);
    formData.append("description", courseDescription);
    formData.append("categoryName", courseCategory);
    if (courseImage) formData.append("image", courseImage);

    await fetch(`http://localhost:8084/api/courses/${course.id}`, {
      method: "PUT",
      body: formData,
    });
    alert("Course updated successfully!");
    navigate("/layout/ViewCourses");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="border p-2 w-full" />
        <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} className="border p-2 w-full" />
        <select value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} className="border p-2 w-full">
          {categories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <input type="file" onChange={handleImageChange} className="border p-2 w-full" />
        <img src={imagePreview} alt="Course" className="w-32 h-32 mt-2" />

        <button type="submit" >Update Course</button>

      </form>
    </div>
  );
};

export default EditCourse;
