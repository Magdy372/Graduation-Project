import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaEdit } from 'react-icons/fa';

const ViewQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8084/api/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleEdit = () => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="text-center p-8">جاري التحميل...</div>;
  if (error) return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">خطأ! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );
  if (!quiz) return <div className="text-center p-8">لم يتم العثور على الاختبار</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowRight className="ml-2" />
          العودة
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FaEdit className="ml-2" />
          تعديل الاختبار
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">الوقت المحدد</p>
                <p className="text-lg font-semibold">{quiz.timeLimit} دقيقة</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">عدد المحاولات المسموحة</p>
                <p className="text-lg font-semibold">{quiz.maxAttempts} محاولات</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">الدرجة الكلية</p>
                <p className="text-lg font-semibold">{quiz.totalGrade} درجة</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-right mb-4">الأسئلة</h3>
            {quiz.questions?.map((question, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4 text-right">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {question.questionType === 'MCQ' ? 'اختيار من متعدد' : 'صح وخطأ'}
                    </span>
                    <h4 className="text-lg font-medium">السؤال {index + 1}</h4>
                  </div>

                  <div className="bg-white p-4 rounded-md">
                    <p className="mb-2">{question.text}</p>
                    <p className="text-sm text-gray-500">({question.grade} درجة)</p>
                  </div>

                  {question.questionType === 'MCQ' ? (
                    <div className="space-y-2">
                      <p className="font-semibold mb-2">الخيارات:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-md border ${
                              option === question.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300'
                            }`}
                          >
                            {option}
                            {option === question.correctAnswer && (
                              <span className="text-green-600 text-sm mr-2">(الإجابة الصحيحة)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-semibold mb-2">الإجابة الصحيحة:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`p-3 rounded-md border ${
                            question.correctAnswer === 'true'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300'
                          }`}
                        >
                          صح
                          {question.correctAnswer === 'true' && (
                            <span className="text-green-600 text-sm mr-2">(الإجابة الصحيحة)</span>
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-md border ${
                            question.correctAnswer === 'false'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300'
                          }`}
                        >
                          خطأ
                          {question.correctAnswer === 'false' && (
                            <span className="text-green-600 text-sm mr-2">(الإجابة الصحيحة)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz; 