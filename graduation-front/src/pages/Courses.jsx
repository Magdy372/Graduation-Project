import React, { Suspense, useEffect, useState } from "react";
import Footer from "../components/Footer";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const FaStethoscope = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaStethoscope }))
);
const FaCapsules = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaCapsules }))
);
const FaMicroscope = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaMicroscope }))
);
const FaSyringe = React.lazy(() =>
  import("react-icons/fa6").then((mod) => ({ default: mod.FaSyringe }))
);
const TbHeartRateMonitor = React.lazy(() =>
  import("react-icons/tb").then((mod) => ({ default: mod.TbHeartRateMonitor }))
);
const FaHandshake = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaHandshake }))
);

export const FadeUp = (delay) => ({
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, duration: 0.5, delay, ease: "easeInOut" },
  },
});

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // All courses from backend
  const [filterCourses, setFilterCourses] = useState([]); // Courses after filtering
  const [category, setCategory] = useState(""); // Selected category
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const coursesPerPage = 9; // Number of courses per page



  // Fetch courses from the backend
  useEffect(() => {

    const token = localStorage.getItem('access_token');  // Ensure this matches your actual token key

        if (!token) {
          navigate("/login"); // Redirect to login if no token
          return;
        }

        
    fetch("http://localhost:8084/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setFilterCourses(data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Filter courses based on category and search query
  const applyFilter = () => {
    let filtered = courses;
    if (category) {
      filtered = filtered.filter((course) => course.categoryName === category);
    }
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilterCourses(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Apply filter whenever category, searchQuery, or courses change
  useEffect(() => {
    applyFilter();
  }, [category, searchQuery, courses]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filterCourses.length / coursesPerPage));
  const displayedCourses = filterCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center p-6 mb-5">
        <motion.h2
          variants={FadeUp(0.6)}
          initial="initial"
          animate="animate"
          className="text-blue text-2xl font-bold"
        >
          Browse through courses
        </motion.h2>

        {/* Search Bar */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
          className="flex justify-center items-center w-full max-w-md mx-auto"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search courses..."
              className="p-3 border border-gray rounded-lg w-full pl-10 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue" />
          </div>
        </motion.div>
      </div>

      <div className="flex gap-10 mt-5 px-5">
        {/* Filter Categories */}
        <div className="border border-gray p-5 rounded-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <motion.div variants={FadeUp(0.8)} initial="initial" animate="animate" className="mt-5">
              {[
                { icon: <FaStethoscope />, label: "Clinical" },
                { icon: <FaCapsules />, label: "Pharmacy" },
                { icon: <FaMicroscope />, label: "Research" },
                { icon: <TbHeartRateMonitor />, label: "Public Health" },
                { icon: <FaSyringe />, label: "Technology" },
                { icon: <FaHandshake />, label: "Professional Development" },
                { icon: null, label: "All Courses" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory(label === "All Courses" ? "" : label)}
                >
                  {icon} {label}
                </button>
              ))}
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
            {displayedCourses.map((course) => (
              <div
                key={course.id}
                className="border border-blue-400 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                onClick={() => navigate("/courseDesc", { state: { course } })}
              >
                <img
                  src={`http://localhost:8084${course.imageUrl}`}
                  alt={course.name}
                  className="w-full h-48 object-cover bg-transparent"
                />
                <div className="p-5">
                  <p className="text-blue text-lg font-medium">{course.name}</p>
                  <p className="text-red text-sm">{course.categoryName}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-3 my-5">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Courses;
