import React, { useState, useEffect } from "react";
import { FaBook, FaPen, FaTrash } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaTh } from "react-icons/fa";

const UploadCourse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryName: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8084/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleUploadClick = async () => {
    const formData = new FormData();
    formData.append(
      "requestDTO",
      new Blob(
        [
          JSON.stringify({
            name: courseData.name,
            description: courseData.description,
            categoryName: courseData.categoryName,
            chapterTitles: chapters.map((chapter) => chapter.name),
          }),
        ],
        { type: "application/json" }
      )
    );

    if (courseData.imageFile) {
      formData.append("image", courseData.imageFile);
    }

    try {
      const response = await fetch("http://localhost:8084/api/courses", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${response.status}\n${errorData.message || "Check your input."}`);
      }
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to connect to the server. Ensure it's running and try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({ ...courseData, imageFile: file });

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseData((prevData) => ({ ...prevData, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddChapter = (chapter) => {
    setChapters([...chapters, chapter]);
  };

  const handleDeleteChapter = (index) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-0" dir="rtl">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Header */}
        <div className="col-span-2 text-right py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue rounded-full mr-1">
              <FaTh className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-blue m-2">إضافة دورة تدريبية</h1>
          </div>
        </div>

        {/* Left Column: Form Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">إعداد الدورة التدريبية</h2>
          <Box>
            <SectionTitle title="عنوان الدورة التدريبية" />
            <input
              type="text"
              name="name"
              value={courseData.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md text-right w-full"
              placeholder="أدخل عنوان الدورة"
            />
          </Box>
          <Box>
            <SectionTitle title="وصف الدورة التدريبية" />
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md text-right w-full"
              placeholder="أدخل وصف الدورة"
            />
          </Box>
          <Box>
            <SectionTitle title="صورة الدورة التدريبية" />
            <ImageUploader onChange={handleImageChange} />
          </Box>
          <Box>
            <SectionTitle title="فئة الدورة التدريبية" />
            <select
              name="categoryName"
              value={courseData.categoryName}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md text-right w-full"
            >
              <option value="">اختر فئة</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </Box>
        </div>

        {/* Right Column: Additional Settings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">فصول الدورة</h2>
          <Box>
            <SectionTitle title="فصول الدورة التدريبية" />
            <ChapterList chapters={chapters} onAddChapter={handleAddChapter} onDeleteChapter={handleDeleteChapter} />
          </Box>
          <div className="flex justify-end">
            <button
              className="bg-blue text-white py-2 px-4 rounded-lg font-medium mt-4 shadow-md hover:bg-red transition-colors duration-300"
              onClick={handleUploadClick}
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <ModalUploadCourse onClose={closeModal} />}
    </div>
  );
};

// Reusable Components
const Box = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full">{children}</div>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-lg font-semibold">{title}</h2>
  </div>
);

const ImageUploader = ({ onChange }) => (
  <div>
    <input type="file" accept="image/*" onChange={onChange} className="mt-2" />
  </div>
);

const ChapterList = ({ chapters, onAddChapter, onDeleteChapter }) => {
  const [newChapter, setNewChapter] = useState("");

  const handleAddChapter = () => {
    if (newChapter.trim()) {
      onAddChapter({ name: newChapter, status: "مسودة" });
      setNewChapter("");
    }
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
          <span>{chapter.name}</span>
          <button onClick={() => onDeleteChapter(index)} className="text-red-500">
            <FaTrash />
          </button>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newChapter}
          onChange={(e) => setNewChapter(e.target.value)}
          placeholder="أدخل اسم الفصل"
          className="border border-gray-300 p-2 rounded-md"
        />
        <button onClick={handleAddChapter} className="text-blue-500">
          إضافة فصل
        </button>
      </div>
    </div>
  );
};

const ModalUploadCourse = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 space-y-4 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">تم رفع الدورة التدريبية بنجاح</h2>
      <p className="text-gray-600">دورتك التدريبية الآن جاهزة.</p>
      <button
        className="bg-blue text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-red transition-colors duration-300"
        onClick={onClose}
      >
        إغلاق
      </button>
    </div>
  </div>
);

export default UploadCourse;