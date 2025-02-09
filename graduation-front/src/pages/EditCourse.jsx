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
    <>
    <h2 className="text-2xl font-bold text-red  text-right mb-4">تعديل بيانات الدورة</h2><div className="flex justify-center items-center bg-white">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full  text-right ">
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label className="block text-blue text-lg mb-1">اسم الدورة</label>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue text-gray-500 text-right " />
          </div>

          <div>
            <label className="block text-blue text-lg mb-1">وصف الدورة</label>
            <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue text-gray-500 text-right" />
          </div>

          <div>
            <label className="block text-blue text-lg mb-1">فئة الدورة</label>
            <select value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue  text-gray-500 text-right">
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between w-full">


            {imagePreview && (
              <img
                src={imagePreview}
                alt="Course"
                className="w-50 h-32 rounded-md border flex flex-col"
              />
            )}
<div className="flex items-center justify-start space-x-2">

  {/* Custom File Input Button on the Left */}
  <label className="cursor-pointer bg-blue text-white px-4 py-2 rounded-md shadow-md hover:bg-red transition text-center w-[200px]">
    اختر صورة
    <input type="file" onChange={handleImageChange} className="hidden" />
  </label>
  <label className="text-blue mb-1">صورة الدورة</label>

</div>

  </div>


          <button type="submit" className=" w-full bg-red text-white py-3 rounded-md hover:bg-blue transition">تعديل البيانات</button>
        </form>
      </div>
    </div></>
  );
};

export default EditCourse;