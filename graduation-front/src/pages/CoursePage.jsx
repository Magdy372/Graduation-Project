import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaPlayCircle, FaDownload } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { jwtDecode } from "jwt-decode";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModalCongrat from '../components/ModalCongrat';
import QuizSecurity from "../utils/quizsec";
import { CourseService, QuizService } from '../services/courepage';

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
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [quizTimeLimit, setQuizTimeLimit] = useState(30);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizSelection, setShowQuizSelection] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [userGrade, setUserGrade] = useState(0);
  const [totalGrade, setTotalGrade] = useState(0);
  const userAnswersRef = useRef({});
  const quizSecurityRef = useRef(null);

  const token = localStorage.getItem('access_token');
  if (!token) {
    navigate("/login");
    return;
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Using CourseService from API import
        const courseData = await CourseService.getCourse(courseId);
        const chaptersData = await CourseService.getChapters(courseId);
        
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setShowQuizSelection(true);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Using QuizService from API import
        if (chapters.length > 0) {
          const allQuizzes = await QuizService.getQuizzesForCourse(chapters);
          setQuizzes(allQuizzes);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]);
      }
    };

    fetchQuizzes();
  }, [chapters]);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      if (selectedQuiz && userId) {
        try {
          // Using QuizService from API import
          const attempts = await QuizService.getQuizAttempts(selectedQuiz.id);
          setQuizAttempts(attempts);
          setCurrentAttempt(attempts.length + 1);
        } catch (error) {
          console.error('Error fetching quiz attempts:', error);
        }
      }
    };

    fetchQuizAttempts();
  }, [selectedQuiz, userId]);

  useEffect(() => {
    const fetchAllQuizAttempts = async () => {
      if (userId) {
        try {
          // Using QuizService from API import
          const attempts = await QuizService.getUserAttempts(userId);
          setQuizAttempts(attempts);
        } catch (error) {
          console.error('Error fetching all quiz attempts:', error);
        }
      }
    };

    fetchAllQuizAttempts();
  }, [userId]);

  const handleQuizSelect = async (quiz) => {
    try {
      // Using QuizService from API import
      const attemptsCount = await QuizService.getAttemptsCount(quiz.id, userId);
      
      if (attemptsCount >= quiz.maxAttempts) {
        alert(`You have reached the maximum number of attempts (${quiz.maxAttempts}) for this quiz.`);
        return;
      }

      setSelectedQuiz(quiz);
      setQuizTimeLimit(quiz.timeLimit);
      setMaxAttempts(quiz.maxAttempts);
      setShowQuizSelection(false);
      
      // Using QuizService from API import
      const transformedQuestions = await QuizService.getQuizQuestions(quiz.id);
      
      setExamQuestions(transformedQuestions);
      setTotalGrade(transformedQuestions.reduce((sum, q) => sum + q.grade, 0));
      setQuestionsLoading(false);
      setExamStarted(true);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestionsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => {
      const newAnswers = { ...prev, [questionIndex]: selectedOption };
      userAnswersRef.current = newAnswers;
      return newAnswers;
    });
  };

  const calculateGrade = () => {
    let grade = 0;
    examQuestions.forEach((question, index) => {
      const userAnswerText = userAnswers[index];
      if (userAnswerText === undefined) return;

      const userAnswerIndex = question.options.indexOf(userAnswerText);
      
      if (question.options.length === 2) {
        if (userAnswerIndex === question.answer) {
          grade += question.grade;
        }
      } else {
        if (userAnswerIndex === question.answer - 1) {
          grade += question.grade;
        }
      }
    });
    return grade;
  };

  useEffect(() => {
    let interval;
    
    if (examStarted && timeLeft === null) {
      const initialTime = quizTimeLimit * 60;
      setTimeLeft(initialTime);
      
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleExamSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [examStarted, quizTimeLimit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExamSubmit = async (isViolation = false) => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const finalAnswers = userAnswersRef.current;
    const calculatedGrade = calculateGrade();
    const percentageScore = Math.round((calculatedGrade / totalGrade) * 100);
    
    setUserAnswers(finalAnswers);
    setUserGrade(calculatedGrade);
    setScore(percentageScore);
    setExamSubmitted(true);
    setShowModal(true);

    // Stop proctoring when exam is submitted
    try {
      await fetch('http://localhost:5000/stop_proctoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error stopping proctoring:', error);
    }
  
    try {
      // Using QuizService from API import
      await QuizService.submitQuizAttempt(selectedQuiz.id, userId, percentageScore);
    } catch (error) {
      console.error('Error handling exam submission:', error);
      // QuizService already handles offline badge functionality
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleCloseQuiz = () => {
    setShowModal(false);
    if(score >= 50) {
      navigate('/feedback');
    } else {
      setShowQuizSelection(false);
    }
  };

  if (!course || !chapters.length) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Add QuizSecurity Component */}
      {examStarted && !examSubmitted && (
        <QuizSecurity 
          ref={quizSecurityRef}
          handleExamSubmit={handleExamSubmit} 
        />
      )}

      {examSubmitted && score >= 50 && <Confetti width={windowWidth} height={windowHeight} />}
      {showModal && (
        <ModalCongrat 
          score={score} 
          userGrade={userGrade}
          totalGrade={totalGrade}
          onClose={handleCloseModal}
          onTryAgain={() => {
            setExamStarted(true);
            setExamSubmitted(false);
            setUserAnswers({});
            setShowModal(false);
          }}
        />
      )}

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
                    {watchedVideos.has(video.id) && <span className="ml-auto text-sm">✓</span>}
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

          <div className="flex-1 flex justify-center items-start mt-3 ml-3">
            <motion.div
              className="w-full max-w-[1200px]"
              variants={FadeUp(0.8)}
              initial="initial"
              animate="animate"
            >
              {!examStarted ? (
                showQuizSelection ? (
                  <div className="w-full h-full p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-6">Select a Quiz</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizzes.map((quiz) => {
                        const userAttempts = quizAttempts.filter(a => a.quizId === quiz.id).length;
                        const remainingAttempts = Math.max(0, quiz.maxAttempts - userAttempts);
                        const hasReachedLimit = userAttempts >= quiz.maxAttempts;;
                        
                        return (
                          <div
                            key={quiz.id}
                            className={`p-4 border rounded-lg hover:border-red cursor-pointer transition-colors ${
                              hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => !hasReachedLimit && handleQuizSelect(quiz)}
                          >
                            <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                            <p className="text-gray-600">Time Limit: {quiz.timeLimit} minutes</p>
                            <p className="text-gray-600">Total Grade: {quiz.totalGrade}</p>
                            <p className="text-gray-600">Questions: {quiz.questions?.length || 0}</p>
                            <div className="mt-2">
                              <p className={`text-sm ${!hasReachedLimit ? 'text-green-600' : 'text-red-600'}`}>
                                Attempts: {userAttempts}/{quiz.maxAttempts}
                              </p>
                              <p className={`text-sm ${!hasReachedLimit ? 'text-green-600' : 'text-red-600'}`}>
                                Remaining Attempts: {remainingAttempts}
                              </p>
                            </div>
                            {hasReachedLimit && (
                              <p className="text-red-600 text-sm mt-2">Maximum attempts reached</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setShowQuizSelection(false)}
                      className="mt-4 p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  selectedVideo && (
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
                        />
                        Your browser does not support the video tag.
                      </video>
                      <div className="bg-white mt-3">
                        <h2 className="text-2xl font-semibold mb-2">{selectedVideo.title}</h2>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                    </>
                  )
                )
              ) : (
                <div className="w-full h-full p-6 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                      {examSubmitted ? 'Exam Results' : selectedQuiz?.title || 'Course Examination'}
                    </h2>
                    {examStarted && !examSubmitted && (
                      <div className="bg-red text-white px-6 py-2 rounded-lg text-xl font-bold">
                        Remaining time : {formatTime(timeLeft)}
                      </div>
                    )}
                  </div>

                  {questionsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
                    </div>
                  ) : examQuestions.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-xl text-gray-600">No questions available for this quiz.</p>
                    </div>
                  ) : (
                    <>
                     {examQuestions.map((question, index) => (
  <div key={index} className="mb-6">
    <h3 
      className="text-xl font-semibold mb-2" 
      style={{ userSelect: 'none' }} // Prevent text selection for question
    >
      Question {index + 1} (Grade: {question.grade}): {question.question}
    </h3>
    <div className="flex flex-col gap-2">
      {question.options.map((option, i) => {
        const isCorrect = question.options.length === 2 
          ? i === question.answer
          : i === (question.answer - 1);
        const isUserAnswer = userAnswers[index] === option;
        const isWrongAnswer = isUserAnswer && !isCorrect;

        return (
          <label 
            key={i} 
            className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
              examSubmitted
                ? isCorrect
                  ? 'bg-green-100'
                  : isWrongAnswer
                  ? 'bg-red-100'
                  : 'bg-red-50'
                : 'hover:bg-red-100'
            }`}
            style={{ userSelect: 'none' }} // Prevent text selection for options
          >
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              checked={isUserAnswer}
              onChange={() => handleAnswerSelect(index, option)}
              disabled={examSubmitted}
              className="form-radio"
            />
            {option}
            {examSubmitted && isCorrect && (
              <span className="ml-auto text-green-600">
                ✓ Correct Answer
              </span>
            )}
            {examSubmitted && isWrongAnswer && (
              <span className="ml-auto text-red-600">
                ✗ Your Answer
              </span>
            )}
          </label>
        );
      })}
    </div>
  </div>
))}

{examSubmitted && (
  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
    <h3 className="text-xl font-semibold mb-2" style={{ userSelect: 'none' }}>
      Exam Results
    </h3>
    <p className="text-lg" style={{ userSelect: 'none' }}>
      Your grade: <span className="font-bold">{userGrade}</span> out of <span className="font-bold">{totalGrade}</span>
    </p>
    <p className="text-lg" style={{ userSelect: 'none' }}>
      Percentage: <span className="font-bold">{score}%</span>
    </p>
    {score >= 50 ? (
      <p className="text-green-600 text-lg mt-2" style={{ userSelect: 'none' }}>
        Congratulations! You passed the exam.
      </p>
    ) : (
      <p className="text-red-600 text-lg mt-2" style={{ userSelect: 'none' }}>
        You didn't pass this attempt. Please try again.
      </p>
    )}
  </div>
                      )}

                      {!examSubmitted ? (
                        <button
                          onClick={handleExamSubmit}
                          className="mt-4 p-3 bg-blue text-white border hover:bg-red rounded-md"
                          disabled={Object.keys(userAnswers).length !== examQuestions.length}
                        >
                          Submit Exam
                        </button>
                      ) : (
                        <button
                          onClick={handleCloseQuiz}
                          className="mt-4 p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          {score >= 50 ? 'Return to Dashboard' : 'Return to Course'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="mt-8 px-5">
          <Card className="bg-white shadow-lg rounded-xl border border-gray w-full">
            <CardHeader
              title={
                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="text-red font-semibold text-lg">
                    Course Summary
                  </Typography>
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

