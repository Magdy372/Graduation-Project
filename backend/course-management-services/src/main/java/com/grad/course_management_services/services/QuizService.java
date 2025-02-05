package com.grad.course_management_services.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grad.course_management_services.dao.QuestionRepository;
import com.grad.course_management_services.dao.QuizRepository;
import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.models.Quiz;
import com.grad.course_management_services.models.Questions.EssayQuestion;
import com.grad.course_management_services.models.Questions.MCQQuestion;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.models.Questions.TrueFalseQuestion;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // ✅ Create a new quiz
    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    // ✅ Get all quizzes
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    // ✅ Get a quiz by ID
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    // ✅ Get quizzes by chapter
    public List<Quiz> getQuizzesByChapter(Long chapterId) {
        return quizRepository.findByChapterId(chapterId);
    }

    // ✅ Update a quiz
    public Quiz updateQuiz(Long quizId, Quiz updatedQuiz) {
        Quiz quiz = getQuizById(quizId);
        quiz.setTitle(updatedQuiz.getTitle());
        quiz.setTotalGrade(updatedQuiz.getTotalGrade());
        return quizRepository.save(quiz);
    }

    // ✅ Delete a quiz
    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }

   

    // ✅ Get all questions for a quiz
    public List<QuestionDTO> getQuestionsByQuiz(Long quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        
        return questions.stream()
                .map(this::createQuestionDTO)  // Call the factory method here
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
        Quiz quiz = getQuizById(quizId);
        List<Question> questions = questionRepository.findByQuizId(quizId);
        double totalGrade = questions.stream().mapToDouble(Question::getGrade).sum();
        quiz.setTotalGrade(totalGrade);
        quizRepository.save(quiz);
    }
public QuestionDTO createQuestionDTO(Question question) {
    if (question instanceof MCQQuestion) {
        MCQQuestion mcq = (MCQQuestion) question;
        return new QuestionDTO("MCQ", mcq.getText(), mcq.getGrade(), mcq.getQuiz().getId(), mcq.getCorrectAnswer(), mcq.getOptions().split(","));
    } else if (question instanceof EssayQuestion) {
        EssayQuestion essay = (EssayQuestion) question;
        return new QuestionDTO("ESSAY", essay.getText(), essay.getGrade(), essay.getQuiz().getId(), essay.getSampleAnswer());
    } else if (question instanceof TrueFalseQuestion) {
        TrueFalseQuestion tf = (TrueFalseQuestion) question;
        return new QuestionDTO("TRUE_FALSE", tf.getText(), tf.getGrade(), tf.getQuiz().getId(), Boolean.toString(tf.isCorrectAnswer()), null);
    } else {
        throw new IllegalArgumentException("Unknown question type: " + question.getClass().getName());
    }
}

  
}


