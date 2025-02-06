import { Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react";

export const FadeUp = (delay = 0) => ({
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
});

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded user ID for demonstration (replace with actual user ID when auth is implemented)
  const userId = 57;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // First fetch user enrollments
        const enrollmentsResponse = await fetch(`http://localhost:8084/enrollments/user/${userId}`);
        const enrollments = await enrollmentsResponse.json();
        
        // Extract course IDs from enrollments
        const courseIds = enrollments.map(e => e.courseId);

        // Fetch all courses
        const coursesResponse = await fetch("http://localhost:8084/api/courses");
        const allCourses = await coursesResponse.json();

        // Filter courses that user is enrolled in
        const enrolledCourses = allCourses.filter(course => 
          courseIds.includes(course.id)
        );

        setEnrolledCourses(enrolledCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleStartWatching = (courseId) => {
      navigate("/CoursePage", { state: { courseId } })
  };

  if (loading) {
    return <div className="p-10 text-center">Loading enrolled courses...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={FadeUp(0.3)}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                className="transition-transform"
              >
                <Card className="p-4 flex-grow">
                  <CardContent>
                    <img 
                      className="h-52 w-full object-cover rounded-md mb-4" 
                      src={`http://localhost:8084${course.imageUrl}`} 
                      alt={course.name} 
                    />
                    <h3 className="font-semibold mb-1 text-blue text-lg">{course.name}</h3>
                    <p className="text-red text-sm mb-2">{course.categoryName}</p>
                    <button 
                      onClick={() => handleStartWatching(course.id)}
                      className="h-[40px] flex items-center justify-center gap-2 text-white font-semibold text-sm w-full bg-blue hover:bg-red py-2 rounded transition-all delay-250"
                    >
                      <FaPlay className="text-white" />
                      Start Watching
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center col-span-full">
              <p className="text-gray-500">You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyCourses;