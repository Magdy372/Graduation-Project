import React, { Suspense, useEffect, useState } from "react";
import courseImage from "../assets/images/course.jpg"; // Import the image
import Footer from "../components/Footer";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';

// Admins Data

const handleDeleteCourse = (course, setFilterCourses, filterCourses) => {
  if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
    setFilterCourses(filterCourses.filter((item) => item.id !== course.id));
  }
};

const FaStethoscope = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaStethoscope })));
const FaCapsules = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaCapsules })));
const FaMicroscope = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaMicroscope })));
const FaSyringe = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaSyringe })));
const TbHeartRateMonitor = React.lazy(() =>
  import("react-icons/tb").then((mod) => ({ default: mod.TbHeartRateMonitor })));
const FaHandshake = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaHandshake })));

export const FadeUp = (delay) => {
  return {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};

// Sample mock courses data
const mockCourses = [
  { id: 1, name: "Clinical Practice", category: "Clinical", image: courseImage },
  { id: 2, name: "Pharmacology and Therapeutics", category: "Pharmacy", image: courseImage },
  { id: 3, name: "Research and Evidence-Based Medicine", category: "Research", image: courseImage },
  { id: 4, name: "Public Health and Preventive Medicine", category: "Public Health", image: courseImage },
  { id: 5, name: "Technology in Medicine and Pharmacy", category: "Technology", image: courseImage },
  { id: 6, name: "Professional Development and Ethics", category: "Professional Development", image: courseImage },
];

const Courses = () => {
  const navigate = useNavigate();
  const [filterCourses, setFilterCourses] = useState(mockCourses);
  const [categories, setCategories] = useState([
    "Clinical",
    "Pharmacy",
    "Research",
    "Public Health",
    "Technology",
    "Professional Development",
  ]); // Initial categories
  const [newCategory, setNewCategory] = useState(""); // State for new category input
  const [editingIndex, setEditingIndex] = useState(null); // State to track which category is being edited
  const [editingValue, setEditingValue] = useState(""); // State for the value being edited
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Function to add a new category
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory(""); // Clear the input after adding
    } else {
      alert("Category already exists or is empty.");
    }
  };

  // Function to save the edited category name
  const saveEdit = (index) => {
    if (editingValue) {
      const updatedCategories = [...categories];
      updatedCategories[index] = editingValue;
      setCategories(updatedCategories);
      setEditingIndex(null); // Clear edit state
      setEditingValue(""); // Clear input
    } else {
      alert("Category name cannot be empty.");
    }
  };

  // Function to delete a category
  const deleteCategory = (index) => {
    if (window.confirm(`Are you sure you want to delete this category?`)) {
      const updatedCategories = categories.filter((_, i) => i !== index);
      setCategories(updatedCategories);
    }
  };

  // Filter courses by category and search query
  const applyFilter = () => {
    let filteredCourses = mockCourses;
    if (searchQuery) {
      filteredCourses = filteredCourses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilterCourses(filteredCourses);
  };

  useEffect(() => {
    applyFilter(); // Apply filter whenever search query changes
  }, [searchQuery]); // Dependency on search query

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4 ml-auto text-right"> الدورات التدريبية</h1>

        {/* Courses Section */}
        <div className="flex justify-between items-center p-6 mb-5">
          <motion.h2
            variants={FadeUp(0.6)}
            initial="initial"
            animate="animate"
            className="text-blue text-2xl font-bold"
          >
            Browse through courses
          </motion.h2>
        </div>

        <div className="flex gap-10 mt-5 px-5">
          <div className="border border-gray p-5 rounded-lg">
            <Suspense fallback={<div>Loading...</div>}>
              <motion.div
                variants={FadeUp(0.8)}
                initial="initial"
                animate="animate"
                className="mt-5"
              >
                {/* Category Buttons */}
                {categories.map((category, index) => (
                  <div key={index} className="flex mb-3">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="p-2 border border-gray rounded-md w-full"
                        onBlur={() => saveEdit(index)} // Save on blur
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            saveEdit(index); // Save on Enter key
                          }
                        }}
                      />
                    ) : (
                      <button
                        className="p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex justify-between items-center"
                        onClick={() => setCategory(category)}
                      >
                        <span className="flex items-center gap-2">
                          {category === "Clinical" && <FaStethoscope />}
                          {category === "Pharmacy" && <FaCapsules />}
                          {category === "Research" && <FaMicroscope />}
                          {category === "Public Health" && <TbHeartRateMonitor />}
                          {category === "Technology" && <FaSyringe />}
                          {category === "Professional Development" && <FaHandshake />}
                          {category}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaEdit
                            className="text-gray-600 cursor-pointer hover:text-blue-600"
                            onClick={() => {
                              setEditingIndex(index);
                              setEditingValue(category);
                            }}
                          />
                          <FaTrash
                            className="text-gray-600 cursor-pointer hover:text-red-600"
                            onClick={() => deleteCategory(index)}
                          />
                        </span>
                      </button>
                    )}
                  </div>
                ))}

                {/* Input for new category */}
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category Name"
                  className="mb-3 p-2 border border-gray rounded-md w-full"
                />
                <button
                  className="mb-3 p-3 bg-blue text-white border w-full hover:bg-red rounded-md"
                  onClick={addCategory}
                >
                  Add Category
                </button>
              </motion.div>
            </Suspense>
          </div>

          {/* Courses Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            className="w-3/4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterCourses.slice(0, 10).map((course) => (
                <div
                  key={course.id}
                  className="border border-blue-400 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 relative"
                  onClick={() =>
                    navigate("/courseDesc", { state: { course } })
                  }
                >
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-48 object-cover bg-transparent"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-center text-red">
                      <p>Available</p>
                    </div>
                    <p className="text-blue text-lg font-medium">
                      {course.name}
                    </p>
                    <p className="text-red text-sm">{course.category}</p>
                  </div>
                  {/* Delete Icon Behind the Text */}
                  <div className="absolute bottom-5 right-5">
                    <FaTrash
                      className="text-gray-600 cursor-pointer hover:text-red-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from bubbling up
                        handleDeleteCourse(course, setFilterCourses, filterCourses);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Courses;