import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { IoBookOutline } from "react-icons/io5";
import { BiCategoryAlt, BiGlobe, BiPlayCircle } from "react-icons/bi";
import { Card, CardHeader, CardContent } from "@mui/material";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import courseImage from "../assets/images/course.jpg"; // Import the image
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion"; // Import framer motion
import Footer from "../components/Footer";
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


// Fade Up Animation Variants
export const FadeUp = (delay = 0) => {
  return {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        duration: 0.5, 
        delay: delay 
      } 
    },
  };
};

const CourseDesc = () => {
  const [course, setCourse] = useState(null); // State to store course details
  const [chapters, setChapters] = useState([]); // State to store course chapters
  const navigate = useNavigate();
  const location = useLocation(); // Access navigation state
  const [recommendations, setRecommendations] = useState([]); // State for recommendations
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!course || !course.name.trim()) {
        setRecommendations([]); // Clear recommendations if course name is empty
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/recommend", {
          method: "POST",  // Ensure this is POST
          headers: {
            "Content-Type": "application/json",  // Make sure this is set to application/json
          },
          body: JSON.stringify({
            course: course.name,  // Send course name to backend
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [course]); // Fetch recommendations whenever course data changes

  // Fetch course details based on the course ID from navigation state
  useEffect(() => {
    const fetchCourseDetails = async () => {
      const courseId = location.state?.course?.id; // Get course ID from navigation state
      if (courseId) {
        try {
          // Fetch course details
          const courseResponse = await fetch(`http://localhost:8084/api/courses/${courseId}`);
          if (!courseResponse.ok) {
            throw new Error("Failed to fetch course details");
          }
          const courseData = await courseResponse.json();
          setCourse(courseData); // Set course details in state

          // Fetch chapters for the course
          const chaptersResponse = await fetch(`http://localhost:8084/api/courses/${courseId}/chapters`);
          if (!chaptersResponse.ok) {
            throw new Error("Failed to fetch chapters");
          }
          const chaptersData = await chaptersResponse.json();
          setChapters(chaptersData); // Set chapters in state
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchCourseDetails();
  }, [location.state?.course?.id]);

  const handleEnrollClick = async () => {
    try {
      const token = localStorage.getItem('access_token');  // Ensure this matches your actual token key

        if (!token) {
          navigate("/login"); // Redirect to login if no token
          return;
        }

        // Decode the token to extract the userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

      // Get course ID from your component's state or props
      const courseId = course.id; // Replace with your actual course ID source
  
      const response = await fetch('http://localhost:8084/enrollments/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&courseId=${courseId}`
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Enrollment failed');
      }
  
      // If enrollment successful, navigate to course page
      navigate("/MyCourses", { state: { courseId } });
    } catch (error) {
      console.error('Enrollment error:', error);
      // Show error to user (you can use a toast or alert)
      alert(error.message);
    }
  };
  const handleRecClick = () => {
    navigate("/CoursePage"); // Redirect to /CoursePage when "Enroll Now" is clicked
  };

  if (!course) {
    return <div>Loading...</div>; // Show loading state while fetching course details
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Title Section */}
        <motion.div
          className="bg-red text-white p-8 rounded-t-lg"
          variants={FadeUp(0.1)}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            className="text-3xl font-bold mb-4"
            variants={FadeUp(0.2)}
          >
            {course.name}
          </motion.h1>
          <motion.p
            className="text-xl mb-4"
            variants={FadeUp(0.3)}
          >
            Course details
          </motion.p>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <motion.span className="flex items-center space-x-1" variants={FadeUp(0.4)}>
              <BiCategoryAlt />
              <span>Category: {course.categoryName}</span>
            </motion.span>
            <motion.span className="flex items-center space-x-1" variants={FadeUp(0.5)}>
              <IoBookOutline />
              <span>Course chapters: {chapters.length}</span>
            </motion.span>
            <motion.span className="flex items-center space-x-1" variants={FadeUp(0.6)}>
              <BiGlobe />
              <span>English</span>
            </motion.span>
            <motion.span className="flex items-center space-x-1" variants={FadeUp(0.7)}>
              <span>Number of enrolled people</span>
            </motion.span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <motion.main
            className="flex-group"
            variants={FadeUp(0.8)}
            initial="initial"
            animate="animate"
          >
            {/* What You Will Learn Card */}
            <Card className="mb-8">
              <CardHeader
                title={<Typography variant="h6" className="text-red text-lg">What you will learn</Typography>}
              />
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-start text-blue">
                    <IoMdCheckmarkCircleOutline className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Lorem Ipsum is simply dummy text of the printing and typesetting</span>
                  </li>
                  {/* More list items */}
                </ul>
              </CardContent>
            </Card>

            {/* Course description card */}
            <Card className="mb-8">
              <CardHeader
                title={<Typography variant="h6" className="text-red text-lg">Course Description</Typography>}
              />
              <CardContent>
                <p className="text-blue">{course.description}</p>
              </CardContent>
            </Card>

            {/* Course Chapters Card */}
            <Card className="mb-8">
              <CardHeader
                title={<Typography variant="h6" className="text-red text-lg">Course Chapters</Typography>}
              />
              <CardContent>
                <ul>
                  {chapters.map((chapter, index) => (
                    <li key={index} className="flex items-center">
                      <BiPlayCircle className="mr-2 h-4 w-4" />
                      <span className="text-blue">{chapter.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.main>

          {/* Sidebar */}
          <motion.aside
            className="w-full md:w-[500px]"
            variants={FadeUp(1.0)}
            initial="initial"
            animate="animate"
          >
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                  <motion.img
                    className="w-[550px] h-[300px] rounded"
                    src={`http://localhost:8084${course.imageUrl}`}
                    alt="Course Thumbnail"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </div>
                <motion.button
                  className="h-[50px] text-white font-semibold text-lg w-full bg-blue hover:bg-red py-2 rounded transition-all delay-250"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleEnrollClick} // Trigger redirect to CoursePage
                >
                  Enroll Now
                </motion.button>
              </CardContent>
            </Card>
          </motion.aside>
        </div>

        
<h3 className="text-2xl  text-red mt-5 mb-5 text-center">Recommended Courses</h3>

<div className="flex flex-wrap gap-4 justify-center">
  {recommendations.length > 0 ? (
    recommendations.map((rec, index) => (
      <Card key={index} className="w-[250px] bg-white shadow-md rounded-lg overflow-hidden">
        <div  className="flex flex-col items-center">
          {/* Course Image */}
          <motion.img
            className="w-full h-[150px] object-cover"
            src={`http://localhost:8084${rec.imageUrl || '/default-course-image.jpg'}`} // Use the image URL from backend or default
            alt={rec.title}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          {/* Course Title */}
          <div className="p-4">
            <h4 className="text-lg font-semibold text-blue">{rec.title}</h4>
            <p hidden className="text-sm text-gray-600">Score: {rec.score.toFixed(2)}</p>
          </div>
        </div>
      </Card>
    ))
  ) : (
    <p>No recommendations available</p>
  )}
</div>



      </div>
   
      <Footer />
    </>
  );
};

export default CourseDesc;