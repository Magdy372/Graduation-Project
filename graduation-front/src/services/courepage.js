/**
 * Service for handling API requests related to courses and quizzes
 */
const API_BASE_URL = 'http://localhost:8084/api';

/**
 * Course-related API functions
 */
export const CourseService = {
  /**
   * Fetch a course by ID
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} - Course data
   */
  getCourse: async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch course: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching course data:', error);
      throw error;
    }
  },

  /**
   * Fetch chapters for a course
   * @param {string} courseId - The course ID
   * @returns {Promise<Array>} - Array of chapter data
   */
  getChapters: async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chapters: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  }
};

/**
 * Quiz-related API functions
 */
export const QuizService = {
  /**
   * Fetch quizzes for a chapter
   * @param {string} chapterId - The chapter ID
   * @returns {Promise<Array>} - Array of quizzes
   */
  getQuizzesByChapter: async (chapterId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/chapter/${chapterId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching quizzes for chapter ${chapterId}:`, error);
      return [];
    }
  },

  /**
   * Fetch all quizzes for a course by fetching each chapter's quizzes
   * @param {Array} chapters - Array of chapter objects
   * @returns {Promise<Array>} - Array of all quizzes
   */
  getQuizzesForCourse: async (chapters) => {
    try {
      const quizzesPromises = chapters.map(chapter => 
        QuizService.getQuizzesByChapter(chapter.id)
      );
      
      const quizzesResults = await Promise.all(quizzesPromises);
      return quizzesResults.flat().filter(quiz => quiz && quiz.id);
    } catch (error) {
      console.error('Error fetching quizzes for course:', error);
      return [];
    }
  },

  /**
   * Get questions for a quiz
   * @param {string} quizId - The quiz ID
   * @returns {Promise<Array>} - Array of questions
   */
  getQuizQuestions: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`);
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }
      
      const questions = await response.json();
      
      // Transform questions to standardized format
      return questions.map(q => {
        if (q.questionType === 'MCQ') {
          return {
            question: q.text,
            options: q.options,
            answer: parseInt(q.correctAnswer),
            grade: q.grade || 1
          };
        } else if (q.questionType === 'TRUE_FALSE') {
          return {
            question: q.text,
            options: ['True', 'False'],
            answer: q.correctAnswer === 'true' ? 0 : 1,
            grade: q.grade || 1
          };
        }
        return null;
      }).filter(q => q !== null);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  },

  /**
   * Get number of attempts for a quiz by a user
   * @param {string} quizId - The quiz ID
   * @param {string} userId - The user ID
   * @returns {Promise<number>} - Number of attempts
   */
  getAttemptsCount: async (quizId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/attempts/count?quizId=${quizId}&userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attempts count: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching attempts count:', error);
      return 0;
    }
  },

  /**
   * Get all attempts for a specific quiz
   * @param {string} quizId - The quiz ID
   * @returns {Promise<Array>} - Array of attempts
   */
  getQuizAttempts: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/attempts/quiz/${quizId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz attempts: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }
  },

  /**
   * Get all attempts by a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - Array of attempts
   */
  getUserAttempts: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/attempts/user/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user attempts: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user attempts:', error);
      return [];
    }
  },

  /**
   * Submit a quiz attempt
   * @param {string} quizId - The quiz ID
   * @param {string} userId - The user ID
   * @param {number} score - The score percentage
   * @returns {Promise<Object>} - Response data
   */
  submitQuizAttempt: async (quizId, userId, score) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/attempts?quizId=${quizId}&userId=${userId}&score=${score}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit quiz attempt: ${response.status}`);
      }
      
      // If score is 50% or higher, add a badge
      if (score >= 50) {
        const currentBadges = parseInt(localStorage.getItem('badgesCount') || '0', 10);
        localStorage.setItem('badgesCount', currentBadges + 1);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      
      // Even if API fails, still add badge for offline functionality
      if (score >= 50) {
        const currentBadges = parseInt(localStorage.getItem('badgesCount') || '0', 10);
        localStorage.setItem('badgesCount', currentBadges + 1);
      }
      
      throw error;
    }
  },
};

export default {
  CourseService,
  QuizService
};