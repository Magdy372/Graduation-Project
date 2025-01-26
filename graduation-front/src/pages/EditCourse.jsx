import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state.course; // Get the course data from location.state

  const [courseName, setCourseName] = useState(course.name);
  const [courseCategory, setCourseCategory] = useState(course.category);

  const handleSave = () => {
    // Logic to save the edited course
    // You can update the state or make an API call to save the data
    console.log("Saved course:", { courseName, courseCategory });
    navigate("/viewCourses"); // Navigate back to the courses view after saving
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">Edit Course</h2>
      <div className="mt-5">
        <label className="block">Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="p-2 border border-gray rounded-md w-full"
        />
      </div>
      <div className="mt-3">
        <label className="block">Category:</label>
        <input
          type="text"
          value={courseCategory}
          onChange={(e) => setCourseCategory(e.target.value)}
          className="p-2 border border-gray rounded-md w-full"
        />
      </div>
      <div className="mt-5">
        <button
          onClick={handleSave}
          className="p-3 bg-blue text-white border w-full hover:bg-red rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditCourse;
