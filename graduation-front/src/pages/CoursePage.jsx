import { FaArrowLeft, FaPlayCircle, FaDownload } from 'react-icons/fa'; 
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import videoDemo from '../assets/videos/rec.mp4';
import { Card, CardHeader, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Footer from '../components/Footer';
import { useState } from 'react'; 
import Confetti from 'react-confetti'; 
import ModalCongrat from '../components/ModalCongrat';  
import { motion } from 'framer-motion';

// Fade-up animation definition
const FadeUp = (delay) => {
  return {
    initial: { opacity: 0, y: 50 },
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

const CoursePage = () => {
  const navigate = useNavigate();
  const [part4Clicked, setPart4Clicked] = useState(false); // State to track if Part 4 is clicked
  const [finished, setFinished] = useState(false); // State to track if Finished button is clicked
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // To make the confetti responsive
  const [windowHeight, setWindowHeight] = useState(window.innerHeight); // To make the confetti responsive
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useState(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to handle Part 4 click
  const handlePart4Click = () => {
    setPart4Clicked(true); // Show the "Finished" button after Part 4 is clicked
  };

  // Function to handle Finished button click
  const handleFinishedClick = () => {
    setFinished(true); // Trigger confetti effect when "Finished" is clicked
    setShowModal(true); // Show the modal on finish
  };

  // Close the modal and navigate to the home page
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Navigate to the home page
  };

  return (
    <>
      {/* Conditionally render confetti effect */}
      {finished && <Confetti width={windowWidth} height={windowHeight} />}
      
      {/* Conditionally render ModalCongrat */}
      {showModal && <ModalCongrat onClose={handleCloseModal} />}

      <Navbar />
      <div className="flex flex-col h-screen bg-white m-6">
        <div className="flex items-center justify-between p-4 bg-white">
          <button
            onClick={() => navigate('/MyCourses')}
            className="mb-3 p-3 bg-white text-blue border w-[250px] hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left w-[250px]"
          >
            <FaArrowLeft />
            <span>Back to my courses page</span>
          </button>
          <motion.h1
            className="text-2xl font-semibold text-red flex-grow ml-16"
            variants={FadeUp(0.2)} // Adding animation
            initial="initial"
            animate="animate"
          >
            Research and Evidence-Based Medicine
          </motion.h1>
        </div>
        
        <div className="flex gap-10 mt-5 px-5">
          {/* Sidebar container with a border to the right */}
          <div className="border border-gray p-5 rounded-lg w-[250px]">
            <motion.button
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.3)}
              initial="initial"
              animate="animate"
            >
              <FaPlayCircle />
              <span>Part 1</span>
            </motion.button>
            <motion.button
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.4)}
              initial="initial"
              animate="animate"
            >
              <FaPlayCircle />
              <span>Part 2</span>
            </motion.button>
            <motion.button
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.5)}
              initial="initial"
              animate="animate"
            >
              <FaPlayCircle />
              <span>Part 3</span>
            </motion.button>
            <motion.button
              onClick={handlePart4Click} // Trigger the state change when clicking Part 4
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.6)}
              initial="initial"
              animate="animate"
            >
              <FaPlayCircle />
              <span>Part 4</span>
            </motion.button>
          </div>

          {/* Video container on the right */}
          <div className="flex-1 flex justify-center items-start mt-3 ml-3">
            <motion.div
              className="w-full max-w-[1200px]"
              variants={FadeUp(0.7)}
              initial="initial"
              animate="animate"
            >
              <video controls className="w-full h-[500px]">
                <source src={videoDemo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="bg-white mt-3">
                <div className="flex justify-between items-center">
                  <motion.h2
                    className="text-2xl font-semibold mb-2"
                    variants={FadeUp(0.8)}
                    initial="initial"
                    animate="animate"
                  >
                    Part 1
                  </motion.h2>
                  {part4Clicked && !finished && (
                    <motion.button
                      onClick={handleFinishedClick}
                      className="mb-3 p-3 bg-white text-blue border hover:bg-red hover:text-white rounded-md flex items-center gap-2"
                      variants={FadeUp(0.9)}
                      initial="initial"
                      animate="animate"
                    >
                      Finished
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* About the Course section in full width under the video and sidebar */}
        <div className="mt-8 px-5">
          <Card className="bg-white shadow-lg rounded-xl border border-gray w-full">
            <CardHeader
              title={
                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="text-red font-semibold text-lg">
                    Course Summary
                  </Typography>
                  <button
                    className="text-lg mb-3 p-3 bg-blue text-white border w-[140px] hover:bg-red rounded-md flex items-center gap-2 text-left w-[150px] text-center"
                  >
                    <FaDownload />
                    Download
                  </button>
                </div>
              }
            />
            <CardContent>
              <Typography variant="body1" color="textSecondary" className="text-blue">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry...
              </Typography>
            </CardContent>
          </Card>
        </div>

      </div>
      <br/>
      <br/>
      <br/>
      <Footer/>
    </>
  );
};

export default CoursePage;
