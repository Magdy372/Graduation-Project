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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chapters
        const chaptersResponse = await fetch(`http://localhost:8084/api/courses/${courseId}/chapters`);
        if (!chaptersResponse.ok) throw new Error('Failed to fetch chapters');
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData);

        // Fetch quizzes for each chapter
        const quizzesData = {};
        for (const chapter of chaptersData) {
          const quizResponse = await fetch(`http://localhost:8084/api/quizzes/chapter/${chapter.id}`);
          if (quizResponse.ok) {
            const quizData = await quizResponse.json();
            if (quizData && Array.isArray(quizData) && quizData.length > 0) {
              // Store only the first quiz if multiple exist
              quizzesData[chapter.id] = quizData[0];
            }
          }
        }
        setQuizzes(quizzesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDeleteQuiz = async (quizId, chapterId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;

    try {
      const response = await fetch(`http://localhost:8084/api/quiz/${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete quiz');

      // Update local state
      const updatedQuizzes = { ...quizzes };
      delete updatedQuizzes[chapterId];
      setQuizzes(updatedQuizzes);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddQuiz = (chapterId) => {
    navigate(`/layout/add-quiz`, {
      state: { 
        course,
        chapterId,
        returnPath: `/layout/manage-quizzes/${courseId}`
      }
    });
  };

  const handleEditQuiz = (quiz) => {
    navigate(`/layout/edit-quiz/${quiz.id}`, {
      state: { 
        quiz,
        returnPath: `/layout/manage-quizzes/${courseId}`
      }
    });
  };

  const handleViewQuiz = (quiz) => {
    navigate(`/layout/view-quiz/${quiz.id}`, {
      state: { 
        quiz,
        returnPath: `/layout/manage-quizzes/${courseId}`
      }
    });
  };

  if (loading) return <div className="text-center p-8">جاري التحميل...</div>;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-right">
        إدارة الاختبارات - {course?.name}
      </h1>

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
                      onClick={() => handleViewQuiz(quizzes[chapter.id])}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="عرض الاختبار"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditQuiz(quizzes[chapter.id])}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="تعديل الاختبار"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quizzes[chapter.id].id, chapter.id)}
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