import React, { Suspense, useEffect, useState } from "react";
import courseImage from "../assets/images/course.jpg"; // Import the image
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
  const [category, setCategory] = useState(""); // Category state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Filter courses by category and search query
  const applyFilter = () => {
    let filteredCourses = mockCourses;
    if (category) {
      filteredCourses = filteredCourses.filter(
        (course) => course.category === category
      );
    }
    if (searchQuery) {
      filteredCourses = filteredCourses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilterCourses(filteredCourses);
  };

  useEffect(() => {
    applyFilter(); // Apply filter whenever category or search query changes
  }, [category, searchQuery]); // Dependency on category and search query

  return (
    <>
      <div>
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
          {/* Centered Search Bar */}
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
              {/* Search Icon inside the input */}
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue" />
            </div>
          </motion.div>
        </div>

        <div className="flex gap-10 mt-5 px-5">
          {/* Filter Categories Section */}
          <div className="border border-gray p-5 rounded-lg">
            <Suspense fallback={<div>Loading...</div>}>
              {/* Filter buttons with icons */}
              <motion.div
                variants={FadeUp(0.8)}
                initial="initial"
                animate="animate"
                className="mt-5"
              >
                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("Clinical")}
                >
                  <FaStethoscope />
                  Clinical
                </button>
                <br />
                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("Pharmacy")}
                >
                  <FaCapsules />
                  Pharmacy
                </button>
                <br />

                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("Research")}
                >
                  <FaMicroscope />
                  Research
                </button>
                <br />

                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("Public Health")}
                >
                  <TbHeartRateMonitor />
                  Public Health
                </button>
                <br />

                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("Technology")}
                >
                  <FaSyringe />
                  Technology
                </button>
                <br />

                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("Professional Development")}
                >
                  <FaHandshake />
                  Professional Development
                </button>
                <br />

                <button
                  className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                  onClick={() => setCategory("")}
                >
                  All Courses
                </button>
                <br />
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
                  className="border border-blue-400 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                  onClick={() =>
                    navigate("/courseDesc", { state: { course } })
                  } // Navigate to CourseDesc page with course data
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
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Courses;
