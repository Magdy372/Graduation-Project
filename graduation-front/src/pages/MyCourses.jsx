import { Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import courseImage from "../assets/images/course.jpg"; // Import the image
import { FaPlay } from "react-icons/fa"; // Import the play icon
import { motion } from "framer-motion"; // Import Framer Motion
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

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

const MyCourses = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleStartWatching = () => {
    navigate(`/CoursePage`); 
  };

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8">
          My Courses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              variants={FadeUp(0.3)} 
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05 }} // Hover effect to scale up
              className="transition-transform"
            >
              <Card className="p-4 flex-grow">
                <CardContent>
                  <img className="h-52 w-full object-cover rounded-md mb-4" src={courseImage} alt="Course Thumbnail" />
                  <h3 className="font-semibold mb-1 text-blue text-lg">Course Title {index + 1}</h3>
                  <p className="text-red text-sm mb-2">Course Category</p>
                  <button 
                    onClick={() => handleStartWatching(index + 1)} // Pass the course index to the function
                    className="h-[40px] flex items-center justify-center gap-2 text-white font-semibold text-sm w-full bg-blue hover:bg-red py-2 rounded transition-all delay-250"
                  >
                    <FaPlay className="text-white" />
                    Start Watching
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyCourses;
