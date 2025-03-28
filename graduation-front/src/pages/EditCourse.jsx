import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateEditCourseForm } from "../utils/courseValidationUtils";

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
  const [errors, setErrors] = useState({});

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
    
    const courseData = {
      name: courseName,
      description: courseDescription,
      categoryName: courseCategory
    };

    const validationErrors = validateEditCourseForm(courseData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", courseName);
    formData.append("description", courseDescription);
    formData.append("categoryName", courseCategory);
    if (courseImage) formData.append("image", courseImage);

    try {
      const response = await fetch(`http://localhost:8084/api/courses/${course.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("تم تحديث الدورة بنجاح!");
        navigate("/layout/ViewCourses");
      } else {
        const errorData = await response.json();
        alert(`خطأ: ${response.status}\n${errorData.message || "يرجى التحقق من المدخلات."}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("فشل الاتصال بالخادم. تأكد من تشغيله وحاول مرة أخرى.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-red text-right mb-4">تعديل بيانات الدورة</h2>
      <div className="flex justify-center items-center bg-white">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full text-right">
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-blue text-lg mb-1">اسم الدورة</label>
              <input 
                type="text" 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)} 
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue text-gray-500 text-right" 
              />
              {errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-blue text-lg mb-1">وصف الدورة</label>
              <textarea 
                value={courseDescription} 
                onChange={(e) => setCourseDescription(e.target.value)} 
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue text-gray-500 text-right" 
              />
              {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-blue text-lg mb-1">فئة الدورة</label>
              <select 
                value={courseCategory} 
                onChange={(e) => setCourseCategory(e.target.value)} 
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue text-gray-500 text-right"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              {errors.categoryName && <p className="text-red text-sm mt-1">{errors.categoryName}</p>}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-blue text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red"
                >
                  تغيير الصورة
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/layout/ViewCourses")}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-blue text-white px-4 py-2 rounded-md hover:bg-red"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCourse;