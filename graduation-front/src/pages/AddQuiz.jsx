import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { validateExam, getFieldError, hasError } from '../utils/examValidationUtils';

const AddQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [errors, setErrors] = useState({});
  
  const [quiz, setQuiz] = useState({
    title: '',
    duration: 30,
    maxAttempts: 3,
    courseId: course?.id,
    questions: []
  });

  // Fetch chapters when the page loads
  useEffect(() => {
    fetchChapters();
  }, [course?.id]);

  const fetchChapters = async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/courses/${course.id}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setErrors({ general: 'حدث خطأ أثناء تحميل الفصول' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate the quiz data
    const validationErrors = validateExam({
      ...quiz,
      chapterId: selectedChapter
    });
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const quizData = {
        title: quiz.title,
        chapterId: parseInt(selectedChapter),
        timeLimit: parseInt(quiz.duration),
        maxAttempts: parseInt(quiz.maxAttempts),
        questions: []
      };

      console.log('Sending quiz data:', quizData); // Debug log

      const response = await fetch('http://localhost:8084/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', response.status, errorData); // Debug log
        setErrors({ general: errorData?.message || 'حدث خطأ أثناء إنشاء الامتحان' });
        return;
      }

      const data = await response.json();
      console.log('Quiz created successfully:', data); // Debug log
      navigate(`/layout/quizzes/${data.id}/add-questions`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setErrors({ general: 'حدث خطأ في الاتصال بالخادم' });
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 text-right">
        <h1 className="text-2xl font-bold mb-4 text-red">إضافة امتحان جديد</h1>
        <p className='text-xl font-semibold mb-6'>{course?.name} : اسم الدورة</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full">
          <div className="mb-4">
            <label className="block text-blue text-lg mb-2 text-right">عنوان الامتحان</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className={`p-2 border rounded w-full text-right text-gray-500 ${
                hasError(errors, 'title') ? 'border-red' : ''
              }`}
            />
            {hasError(errors, 'title') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'title')}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-blue text-lg mb-2 text-right">اختر الفصل</label>
            <select
              className={`p-3 border rounded-md w-full shadow-sm text-right ${
                hasError(errors, 'chapterId') ? 'border-red' : ''
              }`}
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="">اختر الفصل</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
            {hasError(errors, 'chapterId') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'chapterId')}</p>
            )}
          </div>

          <div className="mb-4 text-right">
            <label className="block text-blue mb-2 text-lg">الوقت المحدد (بالدقائق)</label>
            <input
              type="number"
              min="1"
              value={quiz.duration}
              onChange={(e) => setQuiz({ ...quiz, duration: e.target.value })}
              className={`p-2 border rounded w-full text-right text-gray-500 ${
                hasError(errors, 'duration') ? 'border-red' : ''
              }`}
            />
            {hasError(errors, 'duration') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'duration')}</p>
            )}
          </div>

          <div className="mb-4 text-right">
            <label className="block text-blue mb-2 text-lg">العدد الأقصى للمحاولات</label>
            <input
              type="number"
              min="1"
              value={quiz.maxAttempts}
              onChange={(e) => setQuiz({ ...quiz, maxAttempts: e.target.value })}
              className={`p-2 border rounded w-full text-right text-gray-500 ${
                hasError(errors, 'maxAttempts') ? 'border-red' : ''
              }`}
            />
            {hasError(errors, 'maxAttempts') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'maxAttempts')}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red text-sm mb-4">{errors.general}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-blue w-[50%] text-white px-4 py-2 rounded"
            >
              إلغاء
              <FaTimes className="inline ml-2" />
            </button>
            <button type="submit" className="p-3 bg-red text-white rounded-md w-[50%]">
              حفظ الامتحان
              <FaSave className="inline ml-2" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddQuiz;

