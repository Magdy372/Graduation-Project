import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { validateQuestion, getFieldError, hasError } from '../utils/questionValidationUtils';

const AddQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({
    questionType: 'MCQ',
    questionText: '',
    points: 0,
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
    // Clear errors when changing question type
    setErrors({});
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
    // Clear option-specific errors
    const newErrors = { ...errors };
    delete newErrors[`option${index + 1}`];
    setErrors(newErrors);
  };

  const addQuestion = async () => {
    // Validate the question
    const validationErrors = validateQuestion(currentQuestion);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const questionData = {
      questionType: currentQuestion.questionType,
      text: currentQuestion.questionText,
      grade: parseFloat(currentQuestion.points),
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

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'حدث خطأ أثناء إضافة السؤال' });
        return;
      }

      const data = await response.json();
      setQuestions([...questions, data]);
      setCurrentQuestion({
        questionType: 'MCQ',
        questionText: '',
        points: 0,
        correctAnswer: '',
        options: ['', '', '', ''],
        sampleAnswer: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding question:', error);
      setErrors({ general: 'حدث خطأ في الاتصال بالخادم' });
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-red hover:bg-blue text-white px-4 py-2 rounded"
          >
            <FaArrowLeft className="inline mr-2" /> العودة للامتحان
          </button>
          <h1 className="text-2xl font-bold">وضع اسئلة للامتحان</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-right">
          <div className="mb-4">
            <label className="block text-blue mb-2 text-lg">نوع الاسئلة</label>
            <select
              value={currentQuestion.questionType}
              onChange={handleQuestionTypeChange}
              className={`p-2 border rounded w-full text-right text-gray-500 ${
                hasError(errors, 'questionType') ? 'border-red' : ''
              }`}
            >
              <option value="MCQ">إختيار من متعدد</option>
              <option value="TRUE_FALSE">صح/خطأ</option>
            </select>
            {hasError(errors, 'questionType') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'questionType')}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-blue text-lg mb-2">السؤال</label>
            <textarea
              value={currentQuestion.questionText}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
              className={`p-2 border rounded w-full text-gray-500 text-right ${
                hasError(errors, 'questionText') ? 'border-red' : ''
              }`}
              rows="3"
            />
            {hasError(errors, 'questionText') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'questionText')}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-blue text-lg mb-2">الدرجة</label>
            <input
              type="number"
              step="0.5"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: e.target.value })}
              className={`p-2 border rounded w-full text-right text-gray-500 ${
                hasError(errors, 'points') ? 'border-red' : ''
              }`}
            />
            {hasError(errors, 'points') && (
              <p className="text-red text-sm mt-1">{getFieldError(errors, 'points')}</p>
            )}
          </div>

          {currentQuestion.questionType === 'MCQ' && (
            <>
              <div className="mb-4">
                <label className="block text-blue text-lg mb-2">الاختيارات</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className={`p-2 border rounded w-full text-right ${
                        hasError(errors, `option${index + 1}`) ? 'border-red' : ''
                      }`}
                      placeholder={`الاختيار ${index + 1}`}
                    />
                    {hasError(errors, `option${index + 1}`) && (
                      <p className="text-red text-sm mt-1">{getFieldError(errors, `option${index + 1}`)}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-blue text-lg mb-2">الاجابة الصحيحة ( رقم الاختيار )</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  className={`p-2 border rounded w-full text-right text-gray-500 ${
                    hasError(errors, 'correctAnswer') ? 'border-red' : ''
                  }`}
                />
                {hasError(errors, 'correctAnswer') && (
                  <p className="text-red text-sm mt-1">{getFieldError(errors, 'correctAnswer')}</p>
                )}
              </div>
            </>
          )}

          {currentQuestion.questionType === 'ESSAY' && (
            <div className="mb-4">
              <label className="block text-blue text-lg mb-2">اجابة مقترحة</label>
              <textarea
                value={currentQuestion.sampleAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, sampleAnswer: e.target.value })}
                className="p-2 border rounded w-full text-right text-gray-500"
                rows="3"
              />
            </div>
          )}

          {currentQuestion.questionType === 'TRUE_FALSE' && (
            <div className="mb-4">
              <label className="block text-blue mb-2 text-lg">الاجابة الصحيحة </label>
              <select
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                className={`p-2 border rounded w-full text-right text-gray-500 ${
                  hasError(errors, 'correctAnswer') ? 'border-red' : ''
                }`}
              >
                <option value="">اختر الاجابة الصحيحة</option>
                <option value="true">صح</option>
                <option value="false">خطأ</option>
              </select>
              {hasError(errors, 'correctAnswer') && (
                <p className="text-red text-sm mt-1">{getFieldError(errors, 'correctAnswer')}</p>
              )}
            </div>
          )}

          {errors.general && (
            <p className="text-red text-sm mb-4">{errors.general}</p>
          )}

          <button
            onClick={addQuestion}
            className="bg-red text-white px-4 py-2 rounded w-full hover:bg-blue"
          >
            إضافة الاسؤال
            <FaPlus className="inline ml-2 " /> 
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-right">
          <h2 className="text-xl font-semibold mb-4">الاسئلة المضافة</h2>
          {questions.map((q, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <p className="font-semibold">{q.text}</p>
              <p className="text-red">{q.questionType} : النوع</p>
              <p className="text-red">{q.grade} : الدرجة</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddQuestions;