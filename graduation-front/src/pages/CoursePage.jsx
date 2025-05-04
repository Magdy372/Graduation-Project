import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaPlayCircle, FaDownload, FaCertificate } from 'react-icons/fa';
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
import CertificateModal from '../components/CertificateModal';

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
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterQuizzes, setChapterQuizzes] = useState({});
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
  const [quizAttempts, setQuizAttempts] = useState({});
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [userGrade, setUserGrade] = useState(0);
  const [totalGrade, setTotalGrade] = useState(0);
  const userAnswersRef = useRef({});
  const quizSecurityRef = useRef(null);
  const [proctoringError, setProctoringError] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [proctoringStatus, setProctoringStatus] = useState('inactive');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCertificateButton, setShowCertificateButton] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateRequestStatus, setCertificateRequestStatus] = useState(null);
  const [certificateError, setCertificateError] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);

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
        const courseData = await CourseService.getCourse(courseId);
        const chaptersData = await CourseService.getChapters(courseId);
        
        setCourse(courseData);
        setChapters(chaptersData);
        
        // Fetch quizzes for each chapter
        const quizzesData = {};
        for (const chapter of chaptersData) {
          const chapterQuizzes = await QuizService.getQuizzesByChapter(chapter.id);
          quizzesData[chapter.id] = chapterQuizzes;
        }
        setChapterQuizzes(quizzesData);
        
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
      JSON.stringify(watchedVideos)
    );
  }, [watchedVideos, courseId]);

  const handleVideoWatched = (videoId) => {
    const newWatchedVideos = { ...watchedVideos };
    newWatchedVideos[videoId] = true;
    setWatchedVideos(newWatchedVideos);
  };

  const allVideosWatched = () => {
    const totalVideos = chapters.reduce(
      (total, chapter) => total + chapter.videos.length,
      0
    );
    return Object.keys(watchedVideos).length === totalVideos;
  };

  const handleVideoEnded = () => {
    if (selectedVideo) {
      handleVideoWatched(selectedVideo.id);
    }
  };

  const handleExamStart = (chapterId) => {
    setSelectedChapter(chapterId);
    setShowQuizSelection(true);
  };

  const handleAcceptDisclaimer = async () => {
    setShowDisclaimer(false);
    setExamStarted(true);
    
    //Start proctoring here after accepting disclaimer
    try {
      const proctoringResponse = await fetch('http://localhost:5000/start_proctoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: userId,
          quiz_id: selectedQuiz.id,
          course_id: courseId
        })
      });

      if (!proctoringResponse.ok) {
        throw new Error('Failed to start proctoring');
      }
    } catch (error) {
      console.error('Error starting proctoring:', error);
      setProctoringError(true);
      return;
    }
  };

  const handleDeclineDisclaimer = () => {
    setShowDisclaimer(false);
    navigate('/MyCourses');
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

  const handleQuizSelect = async (quiz, chapterId) => {
    try {
      const attemptsCount = await QuizService.getAttemptsCount(quiz.id, userId);
      
      if (attemptsCount >= quiz.maxAttempts) {
        alert(`You have reached the maximum number of attempts (${quiz.maxAttempts}) for this quiz.`);
        return;
      }

      setSelectedQuiz(quiz);
      setQuizTimeLimit(quiz.timeLimit);
      setMaxAttempts(quiz.maxAttempts);
      
      const transformedQuestions = await QuizService.getQuizQuestions(quiz.id);
      setExamQuestions(transformedQuestions);
      setTotalGrade(transformedQuestions.reduce((sum, q) => sum + q.grade, 0));
      setQuestionsLoading(false);
      setShowQuizSelection(false);
      setShowDisclaimer(true); // Show disclaimer after quiz selection
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

    //Stop proctoring
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
      await QuizService.submitQuizAttempt(selectedQuiz.id, userId, percentageScore);
    } catch (error) {
      console.error('Error handling exam submission:', error);
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
      setExamStarted(false);
      setExamSubmitted(false);
      setUserAnswers({});
      setExamQuestions([]);
    }
  };

  useEffect(() => {
    let statusInterval;
    
    if (examStarted && !examSubmitted) {
      // Check proctoring status every 5 seconds
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/get_status');
          const data = await response.json();
          setProctoringStatus(data.status);
          
          if (data.status === 'inactive') {
            setProctoringError(true);
          }
        } catch (error) {
          console.error('Error checking proctoring status:', error);
          setProctoringError(true);
        }
      }, 5000);
    }

    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [examStarted, examSubmitted]);

  // Function to check if all videos in a chapter are watched
  const areAllChapterVideosWatched = (chapterId) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return false;
    
    return chapter.videos.every(video => watchedVideos[video.id]);
  };

  // Add this new function for handling question navigation
  const handleQuestionNavigation = (direction) => {
    if (direction === 'next' && currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Add this function to navigate to a specific question
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Add this useEffect to track tab switching
  useEffect(() => {
    if (!examStarted || examSubmitted) return;
    
    const handleVisibilityChange = async () => {
      try {
        await fetch('http://localhost:5000/tab_switched', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            is_hidden: document.hidden,
            user_id: userId,
            quiz_id: selectedQuiz?.id
          })
        });
        
        if (document.hidden) {
          setWarningMessage("Tab switching detected. This will be recorded as a violation.");
          setTabWarning(true);
        }
      } catch (error) {
        console.error('Error reporting tab switch:', error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examStarted, examSubmitted, userId, selectedQuiz]);

  // Modify the checkCourseCompletion function
  const checkCourseCompletion = () => {
    // Check if all videos are watched
    const allVideosWatched = chapters.every(chapter => {
      return chapter.videos.every(video => watchedVideos[video.id]);
    });

    // Check if all quizzes are attempted
    const allQuizzesAttempted = chapters.every(chapter => {
      const chapterQuizList = chapterQuizzes[chapter.id] || [];
      
      if (chapterQuizList.length === 0) {
        return true;
      }

      return chapterQuizList.every(quiz => {
        const attempts = quizAttempts.filter(attempt => attempt.quizId === quiz.id);
        return attempts.length > 0; // Only check if quiz was attempted
      });
    });

    setShowCertificateButton(allVideosWatched && allQuizzesAttempted);
  };

  // Modify the useEffect to ensure it runs at the right time
  useEffect(() => {
    if (chapters.length > 0 && Object.keys(chapterQuizzes).length > 0) {
      checkCourseCompletion();
    }
  }, [chapters, watchedVideos, quizAttempts, chapterQuizzes]);

  // Add this useEffect to log state changes
  useEffect(() => {
    console.log('Certificate button visibility:', showCertificateButton);
  }, [showCertificateButton]);

  // Add this function to handle certificate request
  const handleCertificateRequest = async () => {
    try {
      setCertificateRequestStatus('loading');
      setCertificateError(null);
      setCertificateData(null);

      const response = await fetch(`http://localhost:8084/api/certificates/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'exists') {
          setCertificateRequestStatus('exists');
          setCertificateData(data.certificate);
        } else if (data.status === 'generated') {
          setCertificateRequestStatus('success');
          setCertificateData(data.certificate);
          setFinalScore(data.certificate.finalScore);
        }
      } else {
        setCertificateRequestStatus('error');
        setCertificateError(data.message || 'Failed to generate certificate. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting certificate:', error);
      setCertificateRequestStatus('error');
      setCertificateError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleRetry = () => {
    setCertificateRequestStatus(null);
    setCertificateError(null);
    handleCertificateRequest();
  };

  if (!course || !chapters.length) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Add QuizSecurity Component */}
      {examStarted && !examSubmitted && (
        <QuizSecurity 
          ref={quizSecurityRef}
          handleExamSubmit={handleExamSubmit}
          onProctoringError={() => setProctoringError(true)}
          onTabWarning={(message) => {
            setWarningMessage(message);
            setTabWarning(true);
          }}
        />
      )}

     

      {tabWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
          <p>{warningMessage}</p>
          <button
            onClick={() => setTabWarning(false)}
            className="mt-2 px-4 py-2 bg-white text-red-500 rounded hover:bg-red-100"
          >
            Dismiss
          </button>
        </div>
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

      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4 text-red">Exam Disclaimer</h2>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                This exam is proctored and monitored. Please note that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>The exam cannot be closed once started</li>
                <li>You must complete the exam in one session</li>
                <li>Your activity will be monitored throughout the exam</li>
                <li>Any attempts to switch tabs or windows may result in exam termination</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeclineDisclaimer}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptDisclaimer}
                className="px-4 py-2 bg-red text-white rounded hover:bg-red-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <div className="flex-grow flex flex-col bg-white m-6">
        <div className="flex items-center justify-between p-4 bg-white">
          {!examStarted && (
            <button
              onClick={() => navigate('/MyCourses')}
              className="mb-3 p-3 bg-white text-blue border w-[250px] hover:bg-red hover:text-white rounded-md flex items-center gap-2 text-left"
            >
              <FaArrowLeft />
              <span>Back to my courses page</span>
            </button>
          )}
          <motion.h1
            className={`text-2xl font-semibold text-red ${!examStarted ? 'flex-grow ml-16' : 'flex-grow'}`}
            variants={FadeUp(0.2)}
            initial="initial"
            animate="animate"
          >
            {course.name}
          </motion.h1>
        </div>

        <div className="flex gap-10 mt-5 px-5 flex-grow">
          {!examStarted && (
            <div className="border border-gray p-5 rounded-lg w-[250px]">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="mb-4">
                  <motion.div
                    className="font-semibold mb-2 text-blue"
                    variants={FadeUp(0.3 + chapterIndex * 0.1)}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="flex justify-between items-center">
                      <span>{chapter.title}</span>
                      {areAllChapterVideosWatched(chapter.id) && (
                        <span className="text-green-600 text-sm">✓ Completed</span>
                      )}
                    </div>
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
                      {watchedVideos[video.id] && <span className="ml-auto text-sm">✓</span>}
                    </motion.button>
                  ))}
                  {areAllChapterVideosWatched(chapter.id) && (
                    <motion.div
                      variants={FadeUp(0.4 + chapterIndex * 0.1)}
                      initial="initial"
                      animate="animate"
                      className="mt-2"
                    >
                      {chapterQuizzes[chapter.id]?.length > 0 ? (
                        <button
                          onClick={() => handleExamStart(chapter.id)}
                          className="w-full p-2 rounded-md text-white text-sm bg-blue hover:bg-red"
                        >
                          Take Chapter Quiz
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No quiz available</p>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
              
              {/* Add Certificate Request Button */}
              {showCertificateButton && (
                <motion.div
                  variants={FadeUp(0.5)}
                  initial="initial"
                  animate="animate"
                  className="mt-6 border-t pt-4"
                >
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <FaCertificate />
                    <span>Request Certificate</span>
                  </button>

                  <CertificateModal
                    isOpen={showCertificateModal}
                    onClose={() => {
                      setShowCertificateModal(false);
                      setCertificateRequestStatus(null);
                      setCertificateError(null);
                    }}
                    status={certificateRequestStatus}
                    certificateData={certificateData}
                    finalScore={finalScore}
                    error={certificateError}
                    onRetry={handleRetry}
                    onRequest={handleCertificateRequest}
                  />
                </motion.div>
              )}
            </div>
          )}

          <div className={`flex-1 flex justify-center items-start mt-3 ${examStarted ? 'ml-0' : 'ml-3'}`}>
            <motion.div
              className="w-full max-w-[1200px]"
              variants={FadeUp(0.8)}
              initial="initial"
              animate="animate"
            >
              {!examStarted ? (
                showQuizSelection ? (
                  <div className="w-full h-full p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-6">
                      {chapters.find(c => c.id === selectedChapter)?.title} - Available Quizzes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chapterQuizzes[selectedChapter]?.map((quiz) => {
                        const userAttempts = quizAttempts.filter(a => a.quizId === quiz.id).length;
                        const remainingAttempts = Math.max(0, quiz.maxAttempts - userAttempts);
                        const hasReachedLimit = userAttempts >= quiz.maxAttempts;
                        
                        return (
                          <div
                            key={quiz.id}
                            className={`p-4 border rounded-lg hover:border-red cursor-pointer transition-colors ${
                              hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => !hasReachedLimit && handleQuizSelect(quiz, selectedChapter)}
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

                  {!questionsLoading ? (
                    examQuestions.length === 0 ? (
                      <div className="text-center p-8">
                        <p className="text-xl text-gray-600">No questions available for this quiz.</p>
                      </div>
                    ) : (
                      <>
                        {/* Question Navigation Buttons */}
                        <div className="flex justify-center gap-2 mb-4">
                          {examQuestions.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToQuestion(index)}
                              className={`w-10 h-10 rounded-full ${
                                currentQuestionIndex === index
                                  ? 'bg-red text-white'
                                  : userAnswers[index]
                                  ? 'bg-blue text-white'
                                  : 'bg-gray-200 text-gray-600'
                              } flex items-center justify-center font-semibold hover:opacity-80`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>

                        {/* Current Question Display */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                              Question {currentQuestionIndex + 1} of {examQuestions.length}
                            </h3>
                            <span className="text-blue font-semibold">
                              Grade: {examQuestions[currentQuestionIndex].grade}
                            </span>
                          </div>

                          <div className="mb-6">
                            <p className="text-lg mb-4" style={{ userSelect: 'none' }}>
                              {examQuestions[currentQuestionIndex].question}
                            </p>
                            <div className="flex flex-col gap-3">
                              {examQuestions[currentQuestionIndex].options.map((option, i) => {
                                const isCorrect = examQuestions[currentQuestionIndex].options.length === 2 
                                  ? i === examQuestions[currentQuestionIndex].answer
                                  : i === (examQuestions[currentQuestionIndex].answer - 1);
                                const isUserAnswer = userAnswers[currentQuestionIndex] === option;
                                const isWrongAnswer = isUserAnswer && !isCorrect;

                                return (
                                  <label 
                                    key={i} 
                                    className={`flex items-center gap-2 p-4 rounded-lg cursor-pointer border ${
                                      examSubmitted
                                        ? isCorrect
                                          ? 'bg-green-100 border-green-400'
                                          : isWrongAnswer
                                          ? 'bg-red-100 border-red-400'
                                          : 'bg-white border-gray-200'
                                        : 'hover:bg-red-50 border-gray-200'
                                    }`}
                                    style={{ userSelect: 'none' }}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${currentQuestionIndex}`}
                                      value={option}
                                      checked={userAnswers[currentQuestionIndex] === option}
                                      onChange={() => handleAnswerSelect(currentQuestionIndex, option)}
                                      disabled={examSubmitted}
                                      className="form-radio h-5 w-5"
                                    />
                                    <span className="text-lg">{option}</span>
                                    {examSubmitted && (isCorrect || isWrongAnswer) && (
                                      <span className={`ml-auto ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {isCorrect ? '✓ Correct Answer' : '✗ Wrong Answer'}
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex justify-between mt-6">
                            <button
                              onClick={() => handleQuestionNavigation('prev')}
                              disabled={currentQuestionIndex === 0}
                              className={`px-6 py-2 rounded-md ${
                                currentQuestionIndex === 0
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-blue text-white hover:bg-red'
                              }`}
                            >
                              Previous Question
                            </button>
                            <button
                              onClick={() => handleQuestionNavigation('next')}
                              disabled={currentQuestionIndex === examQuestions.length - 1}
                              className={`px-6 py-2 rounded-md ${
                                currentQuestionIndex === examQuestions.length - 1
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-blue text-white hover:bg-red'
                              }`}
                            >
                              Next Question
                            </button>
                          </div>
                        </div>

                        {/* Submit Button */}
                        {!examSubmitted ? (
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={handleExamSubmit}
                              className={`px-8 py-3 rounded-md ${
                                Object.keys(userAnswers).length === examQuestions.length
                                  ? 'bg-red text-white hover:bg-red-600'
                                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              }`}
                              disabled={Object.keys(userAnswers).length !== examQuestions.length}
                            >
                              Submit Exam ({Object.keys(userAnswers).length}/{examQuestions.length} Questions Answered)
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                              <h3 className="text-2xl font-semibold mb-4 text-blue">Exam Results</h3>
                              <div className="space-y-4">
                                <p className="text-lg">
                                  Your grade: <span className="font-bold text-red">{userGrade}</span> out of <span className="font-bold">{totalGrade}</span>
                                </p>
                                <p className="text-lg">
                                  Percentage: <span className="font-bold text-red">{score}%</span>
                                </p>
                                {score >= 50 ? (
                                  <p className="text-green-600 text-lg">
                                    Congratulations! You passed the exam.
                                  </p>
                                ) : (
                                  <p className="text-red-600 text-lg">
                                    You didn't pass this attempt. Please try again.
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-center mt-6">
                              <button
                                onClick={() => {
                                  setExamStarted(false);
                                  setExamSubmitted(false);
                                  setUserAnswers({});
                                  setCurrentQuestionIndex(0);
                                  setShowQuizSelection(false);
                                }}
                                className="px-8 py-3 bg-blue text-white rounded-md hover:bg-red transition-colors"
                              >
                                Return to Course
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {!examStarted && (
          <div className="mt-8 px-5">
            <Card className="bg-white shadow-lg rounded-xl border border-gray w-full">
              <CardHeader
                title={
                  <div className="flex justify-between items-center">
                    <Typography variant="h6" className="text-red font-semibold text-lg">
                      video Summary
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CoursePage;

