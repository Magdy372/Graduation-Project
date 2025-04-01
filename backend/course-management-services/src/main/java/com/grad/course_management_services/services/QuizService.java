package com.grad.course_management_services.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grad.course_management_services.dao.QuestionRepository;
import com.grad.course_management_services.dao.QuizRepository;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.dto.QuizDTO;
import com.grad.course_management_services.models.Quiz;
import com.grad.course_management_services.models.Questions.MCQQuestion;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.models.Questions.TrueFalseQuestion;
import com.grad.course_management_services.models.Chapter;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    // Convert Quiz to QuizDTO
    private QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setChapterId(quiz.getChapter().getId());
        dto.setTotalGrade(quiz.getTotalGrade());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setQuestions(getQuestionsByQuiz(quiz.getId()));
        return dto;
    }

    // Convert QuizDTO to Quiz
    private Quiz convertToEntity(QuizDTO dto) {
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());
        quiz.setTotalGrade(dto.getTotalGrade());
        quiz.setTimeLimit(dto.getTimeLimit());
        
        // Set the chapter relationship
        Chapter chapter = chapterRepository.findById(dto.getChapterId())
            .orElseThrow(() -> new RuntimeException("Chapter not found with id: " + dto.getChapterId()));
        quiz.setChapter(chapter);
        
        return quiz;
    }

    // ✅ Create a new quiz
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        Quiz quiz = convertToEntity(quizDTO);
        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz);
    }

    // ✅ Get all quizzes
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Get a quiz by ID
    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return convertToDTO(quiz);
    }

    // ✅ Get quizzes by chapter
    public List<QuizDTO> getQuizzesByChapter(Long chapterId) {
        return quizRepository.findByChapterId(chapterId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Update a quiz
    public QuizDTO updateQuiz(Long quizId, QuizDTO updatedQuizDTO) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        Quiz updatedQuiz = convertToEntity(updatedQuizDTO);
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setTotalGrade(updatedQuiz.getTotalGrade());
        existingQuiz.setTimeLimit(updatedQuiz.getTimeLimit());
        
        Quiz savedQuiz = quizRepository.save(existingQuiz);
        return convertToDTO(savedQuiz);
    }

    // ✅ Delete a quiz
    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }

    // ✅ Get all questions for a quiz
    public List<QuestionDTO> getQuestionsByQuiz(Long quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        
        return questions.stream()
                .map(this::createQuestionDTO)
                .collect(Collectors.toList());
    }

    // ✅ Delete a question
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        Long quizId = question.getQuiz().getId();
        questionRepository.deleteById(questionId);

        // Update total grade after question deletion
        updateTotalGrade(quizId);
    }

    // ✅ Update total grade of a quiz
    private void updateTotalGrade(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        List<Question> questions = questionRepository.findByQuizId(quizId);
        double totalGrade = questions.stream().mapToDouble(Question::getGrade).sum();
        quiz.setTotalGrade(totalGrade);
        quizRepository.save(quiz);
    }

    public QuestionDTO createQuestionDTO(Question question) {
        if (question instanceof MCQQuestion) {
            MCQQuestion mcq = (MCQQuestion) question;
            return new QuestionDTO("MCQ", mcq.getText(), mcq.getGrade(), mcq.getQuiz().getId(), mcq.getCorrectAnswer(), mcq.getOptions().split(","));
        } else if (question instanceof TrueFalseQuestion) {
            TrueFalseQuestion tf = (TrueFalseQuestion) question;
            return new QuestionDTO("TRUE_FALSE", tf.getText(), tf.getGrade(), tf.getQuiz().getId(), Boolean.toString(tf.isCorrectAnswer()), null);
        } else {
            throw new IllegalArgumentException("Unknown question type: " + question.getClass().getName());
        }
    }
}


