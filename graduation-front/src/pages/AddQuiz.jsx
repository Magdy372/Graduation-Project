import React, { useState, useEffect } from 'react'; // Added useEffect import
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
    totalGrade: 0
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
      // Handle validation error
      return;
    }

    try {
      // Find the selected chapter object from chapters array
      const chapter = chapters.find(ch => ch.id == selectedChapter);
      console.log("chapter" + chapter)
      console.log("chapter1" + selectedChapter)
      
      const response = await fetch('http://localhost:8084/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quiz.title,
          chapter: chapter, // Send the entire chapter object
          totalGrade: quiz.totalGrade
        }),
      });
      const data = await response.json();
      navigate(`/quizzes/${data.id}/add-questions`);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Create New Quiz for {course?.name}</h1>
        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quiz Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold">Select Chapter:</label>
            <select
              className="p-3 border rounded-md w-full shadow-sm"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="">Select a Chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Grade</label>
            <input
              type="number"
              value={quiz.totalGrade}
              onChange={(e) => setQuiz({ ...quiz, totalGrade: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="p-3 bg-green-500 text-white rounded-md w-full">
              <FaSave className="inline mr-2" /> Save Quiz
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <FaTimes className="inline mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
  };
export default AddQuiz;

