import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaClock, FaGraduationCap, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ManageQuizzes = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chapters and their quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch chapters
        const chaptersResponse = await fetch(`http://localhost:8084/api/courses/${courseId}/chapters`);
        if (!chaptersResponse.ok) {
          throw new Error('Failed to fetch chapters');
        }
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData);

        // Fetch quizzes for each chapter
        const quizzesData = {};
        for (const chapter of chaptersData) {
          try {
            const quizResponse = await fetch(`http://localhost:8084/api/quizzes/chapter/${chapter.id}`);
            if (quizResponse.ok) {
              const quizData = await quizResponse.json();
              if (quizData && Array.isArray(quizData) && quizData.length > 0) {
                // Store only the first quiz if multiple exist
                quizzesData[chapter.id] = quizData[0];
              }
            }
          } catch (quizError) {
            console.error(`Error fetching quiz for chapter ${chapter.id}:`, quizError);
          }
        }
        setQuizzes(quizzesData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Delete quiz handler
  const handleDeleteQuiz = async (quizId, chapterId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8084/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      // Update local state
      const updatedQuizzes = { ...quizzes };
      delete updatedQuizzes[chapterId];
      setQuizzes(updatedQuizzes);
    } catch (err) {
      setError('Failed to delete quiz: ' + err.message);
      console.error('Error deleting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add quiz handler
  const handleAddQuiz = (chapterId) => {
    if (quizzes[chapterId]) {
      setError('يسمح باختبار واحد فقط لكل فصل');
      return;
    }

    navigate(`/layout/add-quiz`, {
      state: { 
        course,
        chapterId,
        returnPath: `/layout/manage-quizzes/${courseId}`
      }
    });
  };

  // Edit quiz handler
  const handleEditQuiz = (quiz) => {
    if (!quiz || !quiz.id) {
      setError('Quiz data is invalid');
      return;
    }

    navigate(`/layout/edit-quiz/${quiz.id}`, {
      state: { 
        quiz,
        returnPath: `/layout/manage-quizzes/${courseId}`
      }
    });
  };

  // View quiz handler
  const handleViewQuiz = (quiz) => {
    if (!quiz || !quiz.id) {
      setError('Quiz data is invalid');
      return;
    }

    navigate(`/layout/view-quiz/${quiz.id}`, {
      state: { 
        quiz,
        returnPath: `/layout/manage-quizzes/${courseId}`
      }
    });
  };

  if (loading) return <div className="text-center p-8">جاري التحميل...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-right">
        إدارة الاختبارات - {course?.name}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-right">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={() => setError(null)}>
              <span className="sr-only">Close</span>
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            className="border rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-right">{chapter.title}</h2>
            
            {quizzes[chapter.id] ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="text-right">
                    <h3 className="font-semibold text-lg">{quizzes[chapter.id].title}</h3>
                    <div className="flex justify-end items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <FaGraduationCap className="text-blue-600" />
                        <span>{quizzes[chapter.id].totalGrade} درجات</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-green-600" />
                        <span>{quizzes[chapter.id].timeLimit} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaRedo className="text-purple-600" />
                        <span>{quizzes[chapter.id].maxAttempts} محاولات</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">عدد الأسئلة: {quizzes[chapter.id].questions?.length || 0}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewQuiz(quizzes[chapter.id]);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="عرض الاختبار"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditQuiz(quizzes[chapter.id]);
                      }}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="تعديل الاختبار"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuiz(quizzes[chapter.id].id, chapter.id);
                      }}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="حذف الاختبار"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="text-center text-gray-500 text-sm mt-2">
                  <p>يسمح باختبار واحد فقط لكل فصل</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-4">لا يوجد اختبار لهذا الفصل</p>
                <button
                  onClick={() => handleAddQuiz(chapter.id)}
                  className="bg-blue-600 text-blue px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center w-full"
                >
                  <FaPlus className="ml-2" /> إضافة اختبار
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageQuizzes; 