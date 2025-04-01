import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  
  const [quiz, setQuiz] = useState({
    title: '',
    totalGrade: 0,
    timeLimit: 30, // Default time limit of 30 minutes
    questions: []
  });

  // Fetch chapters when the page loads
  useEffect(() => {
    fetchChapters();
  }, [course.id]);

  const fetchChapters = async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/courses/${course.id}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedChapter) {
      alert("Please select a chapter");
      return;
    }

    try {
      const quizData = {
        title: quiz.title,
        chapterId: parseInt(selectedChapter),
        totalGrade: parseFloat(quiz.totalGrade),
        timeLimit: parseInt(quiz.timeLimit),
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
        throw new Error(errorData?.message || `Failed to create quiz: ${response.status}`);
      }

      const data = await response.json();
      console.log('Quiz created successfully:', data); // Debug log
      navigate(`/layout/quizzes/${data.id}/add-questions`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert(`Failed to create quiz: ${error.message}`);
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
              className="p-2 border rounded w-full text-right text-gray-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-blue text-lg mb-2 text-right">اختر الفصل</label>
            <select
              className="p-3 border rounded-md w-full shadow-sm text-right"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              required
            >
              <option value="">اختر الفصل</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 text-right">
            <label className="block text-blue mb-2 text-lg">الدرجة الكلية</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={quiz.totalGrade}
              onChange={(e) => setQuiz({ ...quiz, totalGrade: e.target.value })}
              className="p-2 border rounded w-full text-right text-gray-500"
              required
            />
          </div>

          <div className="mb-4 text-right">
            <label className="block text-blue mb-2 text-lg">الوقت المحدد (بالدقائق)</label>
            <input
              type="number"
              min="1"
              value={quiz.timeLimit}
              onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value })}
              className="p-2 border rounded w-full text-right text-gray-500"
              required
            />
          </div>

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

