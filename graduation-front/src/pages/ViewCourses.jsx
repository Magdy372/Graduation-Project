import React, { useEffect, useState, Suspense } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus,FaCapsules, FaMicroscope, FaHandshake, FaSyringe, FaStethoscope } from "react-icons/fa";
import { TbHeartRateMonitor } from "react-icons/tb";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";


const ViewCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Fetch courses
  useEffect(() => {
    fetch("http://localhost:8084/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:8084/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Apply Filters (Search & Category)
  useEffect(() => {
    let filtered = courses;
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((course) => course.categoryName === selectedCategory);
    }
    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategory, courses]);

  // Handle deleting a course
  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      fetch(`http://localhost:8084/api/courses/${courseId}`, { method: "DELETE" })
        .then(() => {
          setCourses(courses.filter((course) => course.id !== courseId));
        })
        .catch((error) => console.error("Error deleting course:", error));
    }
  };

  // Handle category selection
  const setCategory = (category) => {
    setSelectedCategory(category.name);
  };

    // Handle edit course button click (Navigate to EditCourse)
    const handleEditCourse = (course) => {
      navigate("/layout/editCourse", { state: { course } });
    };
    const handleAddVideo = (course) => {
      navigate("/layout/addvideo", { state: { course } });
    };
  // Handle category edit
  const saveEdit = (index) => {
    if (editingValue.trim() === "") return;
    const updatedCategories = [...categories];
    updatedCategories[index].name = editingValue;

    fetch(`http://localhost:8084/api/categories/${categories[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingValue }),
    })
      .then(() => setCategories(updatedCategories))
      .catch((error) => console.error("Error updating category:", error));

    setEditingIndex(null);
  };

  // Handle category deletion
  const deleteCategory = (index) => {
    const categoryId = categories[index].id;
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    fetch(`http://localhost:8084/api/categories/${categoryId}`, { method: "DELETE" })
      .then(() => {
        setCategories((prev) => prev.filter((_, i) => i !== index));
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  // Handle adding new category
  
    const [errorMessage, setErrorMessage] = useState("");

    const addCategory = () => {
      if (newCategory.trim() === "") {
        setErrorMessage("Category name is required.");
        return;
      }
      setErrorMessage(""); // Clear error if valid
    
      const newCatObj = { name: newCategory };
    
      fetch("http://localhost:8084/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCatObj),
      })
        .then((response) => response.json())
        .then((data) => {
          setCategories([...categories, data]);
          setNewCategory("");
        })
        .catch((error) => console.error("Error adding category:", error));
    };
    

  return (
    <>
      <div className="container mx-auto px-6 ">
        <h1 className="text-3xl font-bold text-center mb-8 text-red text-right"> الدورات التدريبية</h1>

        {/* Search & Category Filter */}
        <div className="flex justify-between items-center mb-6 text-right">
          <input
            type="text"
            placeholder="... بحث الدورات "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border rounded-md w-1/2 shadow-sm focus:outline-none"
          />

          {/* Category Dropdown */}
          <select
            className="p-3 border rounded-md shadow-sm focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">كل الفئات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-10">
          {/* Categories Section */}
          <div className="border border-gray p-5 rounded-lg w-1/4">
            <Suspense fallback={<div>Loading...</div>}>
              <motion.div className="mt-5">
                {categories.map((category, index) => (
                  <div key={index} className="flex mb-3">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="p-2 border border-gray rounded-md w-full"
                        onBlur={() => saveEdit(index)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") saveEdit(index);
                        }}
                      />
                    ) : (
                      <button
                        className={`p-3 w-full rounded-md flex justify-between items-center ${
                          selectedCategory === category.name ? "bg-blue text-white" : "bg-white text-blue"
                        }`}
                        onClick={() => setCategory(category)}
                      >
                        {category.name}
                        <span className="flex items-center gap-2">
                          <FaEdit className="text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => {
                            setEditingIndex(index);
                            setEditingValue(category.name);
                          }} />
                          <FaTrash className="text-gray-600 cursor-pointer hover:text-red-600" onClick={() => deleteCategory(index)} />
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
                  placeholder="اسم الفئة"
                  className="mb-3 p-2 border border-gray rounded-md w-full text-right "
                />
                <button className="mb-3 p-3 bg-blue text-white border w-full hover:bg-red rounded-md" onClick={addCategory}>
                  اضافة فئة
                  
                  

                </button>
                <span>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</span>
              </motion.div>
            </Suspense>
          </div>

                 {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform transform hover:scale-105 relative"
                onClick={() => navigate("/courseDesc", { state: { course } })}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={`http://localhost:8084${course.imageUrl}`}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <p className="text-gray-600">{course.categoryName}</p>
                </div>
                {/* Delete Button */}
                <div className="absolute bottom-5 right-5 flex space-x-3">
                  <FaEdit
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCourse(course);
                    }}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.id);
                    }}
                  />
                  <FaPlus
                    className="text-green-500 cursor-pointer hover:text-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddVideo(course);
                    }}
                  />
                  <FaFileAlt
                    className="text-purple-500 cursor-pointer hover:text-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/layout/add-quiz", { state: { course } });
                    }}
                  />
                </div>
              </motion.div>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCourses;
