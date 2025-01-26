import React, { useState } from "react";
import { FaBook, FaPen } from "react-icons/fa"; // Import the course and pen icons
import { IoCloseCircleOutline } from "react-icons/io5"; // Close icon
import { BsFillCheckCircleFill } from "react-icons/bs"; // Checkmark icon
import { FaTh } from "react-icons/fa"; // Grid icon
import course from "../assets/images/course.jpg";

const UploadCourse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-0" dir="rtl">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Header */}
        <div className="col-span-2 text-right py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue rounded-full mr-1"> {/* Increased margin here */}
              <FaTh className="text-white text-2xl" /> {/* Grid icon */}
            </div>
            <h1 className="text-3xl font-bold text-blue m-2">إضافة دورة تدريبية</h1>
          </div>
        </div>

       

        {/* Left Column: Form Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">إعداد الدورة التدريبية</h2>
          <Box>
            <SectionTitle title="  عنوان الدورة التدريبية" />
            <EditableField value=" عنوان الدورة التدريبية" />
          </Box>
          <Box>
            <SectionTitle title="وصف الدورة التدريبية" />
            <EditableField value="هذا هو الوصف" />
          </Box>
          <Box>
            <SectionTitle title="صورة الدورة التدريبية" />
            <ImageUploader />
          </Box>
          <Box>
            <SectionTitle title="فئة الدورة التدريبية" />
            <EditableField value="تحرير الفئة" />
          </Box>
        </div>

        {/* Right Column: Additional Settings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">فصول الدورة</h2>
          <Box>
            <SectionTitle title="فصول الدورة التدريبية" />
            <ChapterList />
          </Box>
          <h2 className="text-2xl font-semibold text-gray-800"> رفع الفيديو</h2>
          <Box>
            <SectionTitle title="  الفيديو" />
            <AddFileButton />
          </Box>
          <h2 className="text-2xl font-semibold text-gray-800">الموارد والمرفقات</h2>
          <Box>
            <SectionTitle title="الموارد والمرفقات" />
            <AddFileButton />
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

// Reusable Box Component
const Box = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full">{children}</div>
);

// Section Title Component
const SectionTitle = ({ title }) => (
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-lg font-semibold">{title}</h2>
  </div>
);

// Editable Field Component
const EditableField = ({ label, value }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  // Handle toggle of editing mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  // Handle form submission when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false); // Stop editing mode
    }
  };

  // Handle submitting text manually
  const handleSubmit = () => {
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="flex flex-col items-end p-4 bg-gray-50 rounded-md text-right w-full">
      {label && <span className="text-sm font-medium mb-2">{label}</span>}
      <div className="flex items-center justify-end space-x-reverse space-x-2 w-full">
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Listen for Enter key press
            className="border border-gray-300 p-2 rounded-md text-right w-full"
            style={{ direction: "rtl" }}
          />
        ) : (
          <span className="text-gray-800 w-full text-right">{text}</span>
        )}
        <button className="text-blue-500" onClick={handleEditClick}>
          <FaPen className="text-sm" />
        </button>
      </div>
    </div>
  );
};


// Image Uploader Component
const ImageUploader = () => {
  const [image, setImage] = useState(course);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        <img src={image} alt="Course" className="object-cover w-full h-full" />
      </div>
      <button className="text-blue-500 mt-2 flex items-center space-x-1" onClick={handleEditClick}>
        <FaPen className="text-sm" />
        <span>تحرير الصورة</span>
      </button>
      {isEditing && (
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-gray-50"
          />
        </div>
      )}
    </div>
  );
};

// Add File Button Component
const AddFileButton = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  return (
    <div>
      <button
        className="text-blue-500"
        onClick={() => document.getElementById("file-input").click()}
      >
        إضافة ملف
      </button>
      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">الملفات المختارة:</h3>
          <ul>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index} className="text-gray-800">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Chapter List Component
const ChapterList = () => {
  const [chapters, setChapters] = useState([
    { name: "مقدمة"},
    { name: "الوحدة 1"},
  ]);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);
  const [editingChapterName, setEditingChapterName] = useState("");

  const handleAddChapterClick = () => {
    setIsAddingChapter(!isAddingChapter);
  };

  const handleInputChange = (e) => {
    setNewChapterName(e.target.value);
  };

  const handleSubmitAddChapter = () => {
    if (newChapterName.trim()) {
      setChapters([
        ...chapters,
        { name: newChapterName, status: "مسودة" },
      ]);
      setNewChapterName("");
      setIsAddingChapter(false);
    }
  };

  const handleEditClick = (index) => {
    setEditingChapterIndex(index);
    setEditingChapterName(chapters[index].name);
  };

  const handleInputChangeEdit = (e) => {
    setEditingChapterName(e.target.value);
  };

  const handleSubmitEditChapter = () => {
    const updatedChapters = [...chapters];
    updatedChapters[editingChapterIndex].name = editingChapterName;
    setChapters(updatedChapters);
    setEditingChapterIndex(null);
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
        >
          <div className="flex items-center space-x-2">
            {editingChapterIndex === index ? (
              <input
                type="text"
                value={editingChapterName}
                onChange={handleInputChangeEdit}
                className="border border-gray-300 p-2 rounded-md"
              />
            ) : (
              <span>{chapter.name}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{chapter.status}</span>
            {editingChapterIndex === index ? (
              <button className="text-blue-500" onClick={handleSubmitEditChapter}>
                حفظ
              </button>
            ) : (
              <button
                className="text-blue-500 flex items-center space-x-1"
                onClick={() => handleEditClick(index)}
              >
                <FaPen className="text-sm" />
              </button>
            )}
          </div>
        </div>
      ))}
      {isAddingChapter ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newChapterName}
            onChange={handleInputChange}
            placeholder="أدخل اسم الفصل"
            className="border border-gray-300 p-2 rounded-md"
          />
          <button className="text-blue-500" onClick={handleSubmitAddChapter}>
            إضافة فصل
          </button>
        </div>
      ) : (
        <button className="text-blue-500 mt-2" onClick={handleAddChapterClick}>
          إضافة فصل
        </button>
      )}
    </div>
  );
};

const ModalUploadCourse = ({ onClose }) => {
  return (
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
};

export default UploadCourse;
