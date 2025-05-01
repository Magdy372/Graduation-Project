import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaSave, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const EditQuiz = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionType: "MCQ",
    text: "",
    grade: 1,
    correctAnswer: "",
    options: ["", "", "", ""]
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8084/api/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        console.log('Fetched quiz data:', data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz(prev => ({
      ...prev,
      [name]: name === 'title' ? value : Number(value)
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: field === 'grade' ? Number(value) : value,
      ...(field === 'questionType' && {
        options: value === 'MCQ' ? ['', '', '', ''] : [],
        correctAnswer: value === 'TRUE_FALSE' ? 'true' : ''
      })
    };
    setQuiz(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    setQuiz(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleNewQuestionChange = (field, value) => {
    console.log('Field changed:', field, 'New value:', value);
    
    if (field === 'questionType') {
      const updatedQuestion = {
        ...newQuestion,
        questionType: value,
        options: value === 'MCQ' ? ["", "", "", ""] : [],
        correctAnswer: value === 'TRUE_FALSE' ? "true" : ""
      };
      console.log('Updated question after type change:', updatedQuestion);
      setNewQuestion(updatedQuestion);
    } else {
      setNewQuestion(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNewQuestionOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleAddOptionToNewQuestion = () => {
    if (newQuestion.questionType === 'MCQ') {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }));
    }
  };

  const handleRemoveOptionFromNewQuestion = (indexToRemove) => {
    if (newQuestion.options.length <= 2) return; // Maintain minimum 2 options for MCQ
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== indexToRemove)
    }));
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      questionType: "MCQ",
      text: "",
      grade: 1,
      correctAnswer: "",
      options: ["", "", "", ""]
    });
  };

  const handleAddQuestion = async () => {
    // Validate the new question
    if (!newQuestion.text.trim()) {
      alert('يرجى إدخال نص السؤال');
      return;
    }
    if (!newQuestion.grade || newQuestion.grade <= 0) {
      alert('يرجى إدخال درجة صحيحة للسؤال');
      return;
    }

    console.log('Adding new question, type:', newQuestion.questionType);

    // Create the question object based on type
    const questionToAdd = {
      text: newQuestion.text,
      grade: Number(newQuestion.grade),
      quizId: quiz.id,
      questionType: newQuestion.questionType,
      correctAnswer: newQuestion.correctAnswer,
      options: newQuestion.questionType === 'MCQ' ? newQuestion.options : []
    };

    console.log('Question to be added:', questionToAdd);

    try {
      // Send the question to the backend
      const response = await fetch('http://localhost:8084/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionToAdd),
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      const savedQuestion = await response.json();
      console.log('Saved question from backend:', savedQuestion);

      // Update the quiz with the new question
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, savedQuestion]
      }));

      // Reset form and close modal
      resetNewQuestion();
      setShowNewQuestionModal(false);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('حدث خطأ أثناء إضافة السؤال');
    }
  };

  const handleDeleteQuestion = (index) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Create an exact copy of the quiz with the same structure as the fetched data
      const updatedQuiz = {
        id: quiz.id,
        title: quiz.title,
        chapterId: quiz.chapterId,
        totalGrade: Number(quiz.totalGrade),
        timeLimit: Number(quiz.timeLimit),
        maxAttempts: Number(quiz.maxAttempts),
        questions: quiz.questions.map(question => ({
          questionType: question.questionType,
          text: question.text,
          grade: Number(question.grade),
          quizId: quiz.id,
          correctAnswer: question.correctAnswer,
          options: question.options,
          ...(question.id && { id: question.id }) // Include ID only if it exists
        }))
      };

      console.log('Sending updated quiz:', updatedQuiz);

      // First, try to get the current quiz to compare
      const getCurrentQuiz = await fetch(`http://localhost:8084/api/quizzes/${quiz.id}`);
      const currentQuiz = await getCurrentQuiz.json();
      console.log('Current quiz in database:', currentQuiz);

      // Now send the update
      const response = await fetch(`http://localhost:8084/api/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuiz),
      });

      console.log('Update response status:', response.status);
      const responseText = await response.text();
      console.log('Update response text:', responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Failed to update quiz');
      }

      // Navigate back
      if (location.state?.returnPath) {
        navigate(location.state.returnPath);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating quiz:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (location.state?.returnPath) {
      navigate(location.state.returnPath);
    } else {
      navigate(-1);
    }
  };

  if (loading) return <div className="text-center p-8">جاري التحميل...</div>;
  if (error) return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">خطأ! </strong>
        <span className="block sm:inline">{error}</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => setError(null)}
        >
          حاول مرة أخرى
        </button>
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
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FaSave className="ml-2" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div className="text-right">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              عنوان الاختبار
            </label>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md text-right"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-right">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                الوقت المحدد (دقائق)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="timeLimit"
                  value={quiz.timeLimit}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-right"
                  required
                  placeholder="أدخل الوقت بالدقائق"
                />
                <span className="absolute left-3 top-2 text-gray-500 text-sm">دقيقة</span>
              </div>
            </div>

            <div className="text-right">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                عدد المحاولات المسموحة
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="maxAttempts"
                  value={quiz.maxAttempts}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-right"
                  required
                  placeholder="أدخل عدد المحاولات"
                />
                <span className="absolute left-3 top-2 text-gray-500 text-sm">محاولات</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowNewQuestionModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="ml-2" />
                إضافة سؤال
              </button>
              <h2 className="text-2xl font-semibold">الأسئلة</h2>
            </div>

            {/* New Question Modal */}
            {showNewQuestionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewQuestionModal(false);
                        resetNewQuestion();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                    <h3 className="text-xl font-semibold">إضافة سؤال جديد</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="text-right">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        نوع السؤال
                      </label>
                      <select
                        value={newQuestion.questionType}
                        onChange={(e) => handleNewQuestionChange('questionType', e.target.value)}
                        className="w-full p-2 border rounded-md text-right"
                        required
                      >
                        <option value="MCQ">اختيار من متعدد</option>
                        <option value="TRUE_FALSE">صح وخطأ</option>
                      </select>
                    </div>

                    <div className="text-right">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        نص السؤال
                      </label>
                      <input
                        type="text"
                        value={newQuestion.text}
                        onChange={(e) => handleNewQuestionChange('text', e.target.value)}
                        className="w-full p-2 border rounded-md text-right"
                        required
                      />
                    </div>

                    <div className="text-right">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        الدرجة
                      </label>
                      <input
                        type="number"
                        value={newQuestion.grade}
                        onChange={(e) => handleNewQuestionChange('grade', e.target.value)}
                        className="w-full p-2 border rounded-md text-right"
                        required
                        min="0"
                        step="0.5"
                      />
                    </div>

                    {newQuestion.questionType === 'MCQ' ? (
                      <div className="text-right">
                        <div className="flex justify-between items-center mb-2">
                          <button
                            type="button"
                            onClick={handleAddOptionToNewQuestion}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm flex items-center"
                          >
                            <FaPlus className="ml-1" />
                            إضافة خيار
                          </button>
                          <label className="block text-gray-700 text-sm font-bold">
                            الخيارات
                          </label>
                        </div>
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center mb-2">
                            {newQuestion.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOptionFromNewQuestion(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <FaTrash />
                              </button>
                            )}
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleNewQuestionOptionChange(index, e.target.value)}
                              className="w-full p-2 border rounded-md text-right"
                              required
                              placeholder={`الخيار ${index + 1}`}
                            />
                          </div>
                        ))}
                        <div className="mt-2">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            الإجابة الصحيحة
                          </label>
                          <select
                            value={newQuestion.correctAnswer}
                            onChange={(e) => handleNewQuestionChange('correctAnswer', e.target.value)}
                            className="w-full p-2 border rounded-md text-right"
                            required
                          >
                            <option value="">اختر الإجابة الصحيحة</option>
                            {newQuestion.options.map((option, index) => (
                              option && (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              )
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          الإجابة الصحيحة
                        </label>
                        <select
                          value={newQuestion.correctAnswer}
                          onChange={(e) => handleNewQuestionChange('correctAnswer', e.target.value)}
                          className="w-full p-2 border rounded-md text-right"
                          required
                        >
                          <option value="">اختر الإجابة الصحيحة</option>
                          <option value="true">صح</option>
                          <option value="false">خطأ</option>
                        </select>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewQuestionModal(false);
                          resetNewQuestion();
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        إضافة السؤال
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Questions List */}
            {quiz.questions?.map((question, qIndex) => (
              <div key={qIndex} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                  <h3 className="text-lg font-semibold">السؤال {qIndex + 1}</h3>
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      نوع السؤال
                    </label>
                    <div className="text-gray-600 p-2 bg-gray-100 rounded-md">
                      {question.questionType === 'MCQ' ? 'اختيار من متعدد' : 'صح وخطأ'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      نص السؤال
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      className="w-full p-2 border rounded-md text-right"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      الدرجة
                    </label>
                    <input
                      type="number"
                      value={question.grade}
                      onChange={(e) => handleQuestionChange(qIndex, 'grade', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded-md text-right"
                      required
                      min="0"
                      step="0.5"
                    />
                  </div>

                  {question.questionType === 'MCQ' ? (
                    // MCQ Options
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        الخيارات
                      </label>
                      {question.options?.map((option, optIndex) => (
                        <div key={optIndex} className="mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            className="w-full p-2 border rounded-md text-right"
                            required
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          الإجابة الصحيحة
                        </label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full p-2 border rounded-md text-right"
                          required
                        >
                          <option value="">اختر الإجابة الصحيحة</option>
                          {question.options?.map((option, optIndex) => (
                            option && (
                              <option key={optIndex} value={option}>
                                {option}
                              </option>
                            )
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    // True/False Options
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        الإجابة الصحيحة
                      </label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                        className="w-full p-2 border rounded-md text-right"
                        required
                      >
                        <option value="true">صح</option>
                        <option value="false">خطأ</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditQuiz;