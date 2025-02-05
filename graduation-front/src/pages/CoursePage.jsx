import { FaArrowLeft, FaPlayCircle, FaDownload } from 'react-icons/fa'; 
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import videoDemo from '../assets/videos/rec.mp4';
import { Card, CardHeader, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Footer from '../components/Footer';
import { useState, useEffect } from 'react'; 
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
  const [examStarted, setExamStarted] = useState(
    localStorage.getItem('examState') === 'true' // Initialize examStarted from localStorage
  );
  const [examSubmitted, setExamSubmitted] = useState(false); // State to track if the exam has been submitted
  const [userAnswers, setUserAnswers] = useState(
    JSON.parse(localStorage.getItem('userAnswers')) || {} // Initialize userAnswers from localStorage
  );

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Save exam state and answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examState', examStarted);
  }, [examStarted]);

  useEffect(() => {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  // Function to handle Part 4 click
  const handlePart4Click = () => {
    setPart4Clicked(true); // Show the "Finished" button after Part 4 is clicked
  };

  // Function to handle Finished button click
  const handleFinishedClick = () => {
    setFinished(true); // Trigger confetti effect when "Finished" is clicked
    setShowModal(true); // Show the modal on finish
  };

  // Function to handle Exam button click
  const handleExamClick = () => {
    setExamStarted(true); // Start the exam
  };

  // Function to handle Submit Exam button click
  const handleSubmitExam = () => {
    setExamSubmitted(true); // Mark the exam as submitted
    setFinished(true); // Trigger confetti effect
    setShowModal(true); // Show the modal
    setExamStarted(false); // End the exam
    localStorage.removeItem('examState'); // Clear exam state from localStorage
    localStorage.removeItem('userAnswers'); // Clear user answers from localStorage
  };

  // Function to handle user's answer selection
  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));
  };

  // Close the modal and navigate to the home page
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Navigate to the home page
  };

  // Dummy MCQ questions and answers
  const examQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4"
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      answer: "Harper Lee"
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      answer: "Harper Lee"
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      answer: "Harper Lee"
    }    
  ];

  return (
    <div className="flex flex-col min-h-screen"> {/* Full height container */}
      {/* Confetti effect */}
      {finished && <Confetti width={windowWidth} height={windowHeight} />}
      {showModal && <ModalCongrat onClose={handleCloseModal} />}
  
      <Navbar />
  
      {/* Content Wrapper */}
      <div className="flex-grow flex flex-col bg-white m-6">
        <div className="flex items-center justify-between p-4 bg-white">
          <button
            onClick={() => navigate('/MyCourses')}
            className="mb-3 p-3 bg-white text-blue border w-[250px] hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
            disabled={examStarted && !examSubmitted}
          >
            <FaArrowLeft />
            <span>Back to my courses page</span>
          </button>
          <motion.h1
            className="text-2xl font-semibold text-red flex-grow ml-16"
            variants={FadeUp(0.2)}
            initial="initial"
            animate="animate"
          >
            Research and Evidence-Based Medicine
          </motion.h1>
        </div>
  
        {/* Main Content (Sidebar + Video) */}
        <div className="flex gap-10 mt-5 px-5 flex-grow">
          {/* Sidebar */}
          <div className="border border-gray p-5 rounded-lg w-[250px]">
            <motion.button
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.3)}
              initial="initial"
              animate="animate"
              disabled={examStarted && !examSubmitted}
            >
              <FaPlayCircle />
              <span>Part 1</span>
            </motion.button>
            <motion.button
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.4)}
              initial="initial"
              animate="animate"
              disabled={examStarted && !examSubmitted}
            >
              <FaPlayCircle />
              <span>Part 2</span>
            </motion.button>
            <motion.button
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.5)}
              initial="initial"
              animate="animate"
              disabled={examStarted && !examSubmitted}
            >
              <FaPlayCircle />
              <span>Part 3</span>
            </motion.button>
            <motion.button
              onClick={handlePart4Click}
              className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
              variants={FadeUp(0.6)}
              initial="initial"
              animate="animate"
              disabled={examStarted && !examSubmitted}
            >
              <FaPlayCircle />
              <span>Part 4</span>
            </motion.button>
            {part4Clicked && !examStarted && (
              <motion.button
                onClick={handleExamClick}
                className="mb-3 p-3 bg-white text-blue border w-full hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
                variants={FadeUp(0.7)}
                initial="initial"
                animate="animate"
              >
                <span>Start Exam</span>
              </motion.button>
            )}
          </div>
  
          {/* Video Section */}
          <div className="flex-1 flex justify-center items-start mt-3 ml-3">
            <motion.div
              className="w-full max-w-[1200px]"
              variants={FadeUp(0.8)}
              initial="initial"
              animate="animate"
            >
              {!examStarted ? (
                <>
                  <video controls className="w-full h-[500px]">
                    <source src={videoDemo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="bg-white mt-3">
                    <div className="flex justify-between items-center">
                      <motion.h2
                        className="text-2xl font-semibold mb-2"
                        variants={FadeUp(0.9)}
                        initial="initial"
                        animate="animate"
                      >
                        Part 1
                      </motion.h2>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full">
                  {examQuestions.map((question, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
                      <div className="flex flex-col gap-2">
                        {question.options.map((option, i) => (
                          <label key={i} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              checked={userAnswers[index] === option}
                              onChange={() => handleAnswerSelect(index, option)}
                              disabled={examSubmitted}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleSubmitExam}
                    className="mt-4 p-3 bg-blue text-white border hover:bg-red rounded-md"
                    disabled={examSubmitted}
                  >
                    Submit Exam
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* About the Course Section */}
        {!examStarted && (
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
                      disabled={examStarted && !examSubmitted}
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
        )}
      </div>
  
      {/* Footer (Always at Bottom) */}
      <Footer />
    </div>
  );
  
};

export default CoursePage;