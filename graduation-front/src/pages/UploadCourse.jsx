import React, { useState } from "react";
import { FaBook, FaPen } from "react-icons/fa"; // Import the course and pen icons
import { IoCloseCircleOutline } from "react-icons/io5"; // Close icon
import { BsFillCheckCircleFill } from "react-icons/bs"; // Checkmark icon
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
    <div className="bg-gray-100 min-h-screen p-0">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left Column: Customize Your Course Header with Icon */}
        <div className="col-span-2 text-left py-4 flex items-center justify-between"> {/* Adjusted padding and layout */}
          <FaBook className="text-blue text-3xl mr-4" /> {/* Positioned icon to the left of the title */}
          <h1 className="text-3xl font-bold text-gray-800">Course Setup</h1> {/* Title */}
        </div>

        {/* Left Column: Form Section */}
        <div className="space-y-4"> {/* Reduced space between sections */}
          {/* Course Title */}
          <h2 className="text-2xl font-semibold text-gray-800">Sell Your course</h2>
          <Box>
            <SectionTitle title="Course Title" />
            <EditableField value="test123" />
          </Box>

          {/* Course Description */}
          <Box>
            <SectionTitle title="Course Description" />
            <EditableField value="this is a description" />
          </Box>

          {/* Course Image */}
          <Box>
            <SectionTitle title="Course Image" />
            <ImageUploader />
          </Box>

          {/* Course Category */}
          <Box>
            <SectionTitle title="Course Category" />
            <EditableField value="Edit category" />
          </Box>
        </div>

        {/* Right Column: Additional Settings */}
        <div className="space-y-4"> {/* Reduced space between sections */}
          {/* Course Chapters */}
          <h2 className="text-2xl font-semibold text-gray-800">Course Chapters</h2>
          <Box>
            <SectionTitle title="Course Chapters" />
            <ChapterList />
          </Box>

          {/* New Header: Sell Your You Box */}
          <h2 className="text-2xl font-semibold text-gray-800">Sell Your course</h2>

          {/* Sell Your Course */}
          <Box>
            <EditableField label="Course price" value="$99.99" />
          </Box>

          {/* Resources & Attachments */}
          <h2 className="text-2xl font-semibold text-gray-800">Resources & attachements</h2>
          <Box>
            <SectionTitle title="Resources & Attachments" />
            <AddFileButton />
          </Box>

          <div className="flex justify-start">
            <button
              className="bg-blue text-white py-2 px-4 rounded-lg font-medium mt-4 shadow-md hover:bg-red transition-colors duration-300"
              onClick={handleUploadClick}
            >
              Upload Your Course
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
    <h2 className="text-lg font-semibold">{title}</h2> {/* Title text */}
  </div>
);

// Editable Field Component
const EditableField = ({ label, value }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="flex flex-col items-start justify-between p-4 bg-gray-50 rounded-md">
      <span className="text-sm font-medium mb-2">{label}</span> {/* Label text below the title */}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        ) : (
          <span className="text-gray-800">{text}</span>
        )}
        <button className="text-blue-500" onClick={handleEditClick}>
          <FaPen className="text-sm" /> {/* Pen icon for edit */}
        </button>
      </div>
    </div>
  );
};

// Image Uploader Component
const ImageUploader = () => {
  const [image, setImage] = useState(course);  // Initial image
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode when button is clicked
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the first file selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // Set the uploaded image as the new image source
      };
      reader.readAsDataURL(file);  // Read the file as a data URL
    }
  };

  return (
    <div>
      <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={image}  // Display the selected image or default image
          alt="Course"
          className="object-cover w-full h-full"
        />
      </div>
      <button className="text-blue-500 mt-2 flex items-center space-x-1" onClick={handleEditClick}>
        <FaPen className="text-sm" /> {/* Pen icon for image edit */}
        <span>Edit image</span>
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
    setSelectedFiles([...selectedFiles, ...files]);  // Add selected files to the state
  };

  return (
    <div>
      <button
        className="text-blue-500"
        onClick={() => document.getElementById("file-input").click()}
      >
        Add a file
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
          <h3 className="font-semibold">Selected Files:</h3>
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

// Chapter List Component with Add and Edit Chapter Functionality
const ChapterList = () => {
  const [chapters, setChapters] = useState([
    { name: "Introduction", status: "Draft" },
    { name: "Module 1", status: "Draft" },
  ]);
  const [isAddingChapter, setIsAddingChapter] = useState(false);  // Toggle add chapter form visibility
  const [newChapterName, setNewChapterName] = useState("");  // State for the new chapter name
  const [editingChapterIndex, setEditingChapterIndex] = useState(null); // Track which chapter is being edited
  const [editingChapterName, setEditingChapterName] = useState(""); // State for the chapter being edited

  const handleAddChapterClick = () => {
    setIsAddingChapter(!isAddingChapter);  // Toggle form visibility
  };

  const handleInputChange = (e) => {
    setNewChapterName(e.target.value);
  };

  const handleSubmitAddChapter = () => {
    if (newChapterName.trim()) {
      setChapters([
        ...chapters,
        { name: newChapterName, status: "Draft" },
      ]);
      setNewChapterName("");  // Clear input field after submission
      setIsAddingChapter(false);  // Hide form
    }
  };

  const handleEditClick = (index) => {
    setEditingChapterIndex(index);
    setEditingChapterName(chapters[index].name);  // Pre-populate the input with the current name
  };

  const handleInputChangeEdit = (e) => {
    setEditingChapterName(e.target.value);
  };

  const handleSubmitEditChapter = () => {
    const updatedChapters = [...chapters];
    updatedChapters[editingChapterIndex].name = editingChapterName;
    setChapters(updatedChapters);
    setEditingChapterIndex(null);  // Exit editing mode
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
                Save
              </button>
            ) : (
              <button
                className="text-blue-500 flex items-center space-x-1"
                onClick={() => handleEditClick(index)}
              >
                <FaPen className="text-sm" /> {/* Pen icon for chapter edit */}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Chapter Button */}
      {isAddingChapter ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newChapterName}
            onChange={handleInputChange}
            placeholder="Enter chapter name"
            className="border border-gray-300 p-2 rounded-md"
          />
          <button className="text-blue-500" onClick={handleSubmitAddChapter}>
            Add Chapter
          </button>
        </div>
      ) : (
        <button className="text-blue-500 mt-2" onClick={handleAddChapterClick}>
          Add a chapter
        </button>
      )}
    </div>
  );
};

const ModalUploadCourse = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500"
        >
          <IoCloseCircleOutline />
        </button>
        <div className="text-4xl text-green-500 mb-4">
          <BsFillCheckCircleFill />
        </div>
        <h1 className="text-lg text-gray-700">
          Your Course has been uploaded Successfully
        </h1>
        <p>Go to your courses page to start watching your courses!</p>
      </div>
    </div>
  );
};

export default UploadCourse;
