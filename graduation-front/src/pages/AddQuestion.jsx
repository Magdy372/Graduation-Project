import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionType: 'MCQ',
    text: '',
    grade: 0,
    correctAnswer: '',
    options: ['', '', '', ''],
    sampleAnswer: '',
  });

  const handleQuestionTypeChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      questionType: e.target.value,
      correctAnswer: '',
      options: e.target.value === 'MCQ' ? ['', '', '', ''] : [],
      sampleAnswer: '',
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = async () => {
    const questionData = {
      questionType: currentQuestion.questionType,
      text: currentQuestion.text,
      grade: parseFloat(currentQuestion.grade),
      quizId: parseInt(quizId),
      correctAnswer: currentQuestion.correctAnswer,
      options: currentQuestion.questionType === 'MCQ' ? currentQuestion.options : undefined,
      sampleAnswer: currentQuestion.questionType === 'ESSAY' ? currentQuestion.sampleAnswer : undefined,
    };

    try {
      const response = await fetch('http://localhost:8084/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });
      const data = await response.json();
      setQuestions([...questions, data]);
      setCurrentQuestion({
        questionType: 'MCQ',
        text: '',
        grade: 0,
        correctAnswer: '',
        options: ['', '', '', ''],
        sampleAnswer: '',
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Add Questions to Quiz</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            <FaArrowLeft className="inline mr-2" /> Back to Quiz
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Question Type</label>
            <select
              value={currentQuestion.questionType}
              onChange={handleQuestionTypeChange}
              className="p-2 border rounded w-full"
            >
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="ESSAY">Essay</option>
              <option value="TRUE_FALSE">True/False</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Question Text</label>
            <textarea
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              className="p-2 border rounded w-full"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Grade</label>
            <input
              type="number"
              step="0.5"
              value={currentQuestion.grade}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, grade: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          {currentQuestion.questionType === 'MCQ' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Options</label>
                {currentQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="p-2 border rounded w-full mb-2"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Correct Answer (Option Number)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  className="p-2 border rounded w-full"
                />
              </div>
            </>
          )}

          {currentQuestion.questionType === 'ESSAY' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sample Answer</label>
              <textarea
                value={currentQuestion.sampleAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, sampleAnswer: e.target.value })}
                className="p-2 border rounded w-full"
                rows="3"
              />
            </div>
          )}

          {currentQuestion.questionType === 'TRUE_FALSE' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Correct Answer</label>
              <select
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Correct Answer</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          <button
            onClick={addQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            <FaPlus className="inline mr-2" /> Add Question
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Added Questions</h2>
          {questions.map((q, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <p className="font-semibold">{q.text}</p>
              <p className="text-gray-600">Type: {q.questionType}</p>
              <p className="text-gray-600">Grade: {q.grade}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddQuestions;