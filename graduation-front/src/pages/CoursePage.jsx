import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlayCircle, FaDownload } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModalCongrat from '../components/ModalCongrat';
import videoDemo from '../assets/videos/rec.mp4';

const FadeUp = (delay) => ({
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
});

const CoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = location.state || {};
  
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem(`watchedVideos_${courseId}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [quizzes, setQuizzes] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await fetch(`http://localhost:8084/api/courses/${courseId}`);
        const chaptersRes = await fetch(`http://localhost:8084/api/courses/${courseId}/chapters`);
        
        const courseData = await courseRes.json();
        const chaptersData = await chaptersRes.json();
        
        setCourse(courseData);
        setChapters(chaptersData);
        
        if (chaptersData.length > 0 && chaptersData[0].videos.length > 0) {
          setSelectedVideo(chaptersData[0].videos[0]);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save watched videos to localStorage
  useEffect(() => {
    localStorage.setItem(
      `watchedVideos_${courseId}`,
      JSON.stringify(Array.from(watchedVideos))
    );
  }, [watchedVideos, courseId]);

  const handleVideoWatched = (videoId) => {
    const newWatchedVideos = new Set(watchedVideos);
    newWatchedVideos.add(videoId);
    setWatchedVideos(newWatchedVideos);
  };

  const allVideosWatched = () => {
    const totalVideos = chapters.reduce(
      (total, chapter) => total + chapter.videos.length,
      0
    );
    return watchedVideos.size === totalVideos;
  };

  const handleVideoEnded = () => {
    if (selectedVideo) {
      handleVideoWatched(selectedVideo.id);
    }
  };

  const handleExamStart = () => {
    setExamStarted(true);
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    examQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correct++;
      }
    });
    return (correct / examQuestions.length) * 100;
  };

  const handleExamSubmit = () => {
    const score = calculateScore();
    setExamSubmitted(true);
    setShowModal(true);
    // You can add API call here to save the exam results
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  // Add this useEffect for fetching quizzes and questions
  useEffect(() => {
    const fetchQuizzesAndQuestions = async () => {
      try {
        // Fetch all quizzes for the course's chapters
        const quizzesPromises = chapters.map(chapter => 
          fetch(`http://localhost:8084/api/quizzes/chapter/${chapter.id}`).then(res => res.json())
        );
        const quizzesResults = await Promise.all(quizzesPromises);
        const allQuizzes = quizzesResults.flat();
        setQuizzes(allQuizzes);

        // Fetch questions for all quizzes
        const questionsPromises = allQuizzes.map(quiz => 
          fetch(`http://localhost:8084/api/quizzes/${quiz.id}/questions`).then(res => res.json())
        );
        const questionsResults = await Promise.all(questionsPromises);
        const allQuestions = questionsResults.flat();

        // Transform questions to exam format
        const transformedQuestions = allQuestions.map(q => {
          if (q.questionType === 'MCQ') {
            return {
              question: q.text,
              options: q.options,
              answer: q.correctAnswer
            };
          } else if (q.questionType === 'TRUE_FALSE') {
            return {
              question: q.text,
              options: ['True', 'False'],
              answer: q.correctAnswer === 'true' ? 'True' : 'False'
            };
          }
          return null;
        }).filter(q => q !== null);

        setExamQuestions(transformedQuestions);
        setQuestionsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestionsLoading(false);
      }
    };

    if (chapters.length > 0) {
      fetchQuizzesAndQuestions();
    }
  }, [chapters]);


  if (!course || !chapters.length) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {examSubmitted && <Confetti width={windowWidth} height={windowHeight} />}
      {showModal && <ModalCongrat onClose={handleCloseModal} />}
  
      <Navbar />
  
      <div className="flex-grow flex flex-col bg-white m-6">
        <div className="flex items-center justify-between p-4 bg-white">
          <button
            onClick={() => navigate('/MyCourses')}
            className="mb-3 p-3 bg-white text-blue border w-[250px] hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
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
            {course.name}
          </motion.h1>
        </div>
  
        <div className="flex gap-10 mt-5 px-5 flex-grow">
          {/* Video List Sidebar */}
          <div className="border border-gray p-5 rounded-lg w-[250px]">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="mb-4">
                <motion.div
                  className="font-semibold mb-2 text-blue"
                  variants={FadeUp(0.3 + chapterIndex * 0.1)}
                  initial="initial"
                  animate="animate"
                >
                  {chapter.title}
                </motion.div>
                {chapter.videos.map((video, videoIndex) => (
                  <motion.button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`mb-2 p-2 w-full text-left rounded-md flex items-center gap-2 ${
                      selectedVideo?.id === video.id 
                        ? 'bg-red text-white' 
                        : 'bg-white text-blue hover:bg-red hover:text-white'
                    }`}
                    variants={FadeUp(0.4 + chapterIndex * 0.1 + videoIndex * 0.05)}
                    initial="initial"
                    animate="animate"
                  >
                    <FaPlayCircle />
                    <span>{video.title}</span>
                    {watchedVideos.has(video.id) && (
                      <span className="ml-auto text-sm">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            ))}
            {allVideosWatched() && !examStarted && !examSubmitted && (
              <motion.button
                onClick={handleExamStart}
                className="mt-4 p-3 bg-blue text-white w-full rounded-md hover:bg-red"
                variants={FadeUp(0.9)}
                initial="initial"
                animate="animate"
              >
                Start Exam
              </motion.button>
            )}
          </div>
  
          {/* Main Content Area */}
          <div className="flex-1 flex justify-center items-start mt-3 ml-3">
            <motion.div
              className="w-full max-w-[1200px]"
              variants={FadeUp(0.8)}
              initial="initial"
              animate="animate"
            >
              {!examStarted ? (
                // Video Player Section
                <>
                  {selectedVideo && (
                    <>
                      <video 
                        key={selectedVideo.id}
                        controls 
                        className="w-full h-[500px]"
                        onEnded={handleVideoEnded}
                        crossOrigin="anonymous"
                      >
                        <source 
                          src={`http://localhost:8084${selectedVideo.videoPath}`} 
                          type="video/mp4" 
                          crossOrigin="anonymous"
                        />
                      </video>
                      <div className="bg-white mt-3">
                        <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-semibold mb-2">
                            {selectedVideo.title}
                          </h2>
                        </div>
                        <p className="text-gray-600">
                          {course.description}
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                // Updated Exam Section
                <div className="w-full h-full p-6 bg-white rounded-lg shadow">
                  <h2 className="text-2xl font-semibold mb-6">Course Examination</h2>
                  {questionsLoading ? (
                    <p>Loading questions...</p>
                  ) : examQuestions.length === 0 ? (
                    <p>No questions available for this exam.</p>
                  ) : (
                    examQuestions.map((question, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="flex flex-col gap-2">
                          {question.options.map((option, i) => (
                            <label 
                              key={i} 
                              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={userAnswers[index] === option}
                                onChange={() => handleAnswerSelect(index, option)}
                                disabled={examSubmitted}
                                className="form-radio"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                  {!examSubmitted && (
                    <button
                      onClick={handleExamSubmit}
                      className="mt-4 p-3 bg-blue text-white border hover:bg-red rounded-md"
                      disabled={Object.keys(userAnswers).length !== examQuestions.length}
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
  
        {/* Course Summary Section */}
        <div className="mt-8 px-5">
          <Card className="bg-white shadow-lg rounded-xl border border-gray w-full">
            <CardHeader
              title={
                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="text-red font-semibold text-lg">
                    Course Summary
                  </Typography>
                  <button className="text-lg mb-3 p-3 bg-blue text-white border w-[140px] hover:bg-red rounded-md flex items-center gap-2 text-left w-[150px] text-center">
                    <FaDownload />
                    Download
                  </button>
                </div>
              }
            />
            <CardContent>
              <Typography variant="body1" color="textSecondary" className="text-blue">
                {selectedVideo?.videoSummary || 'No summary available'}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
  
      <Footer />
    </div>
  );
};

export default CoursePage;