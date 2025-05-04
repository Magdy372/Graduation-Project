package com.grad.course_management_services.services;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grad.course_management_services.dao.QuestionRepository;
import com.grad.course_management_services.dao.QuizRepository;
import com.grad.course_management_services.clients.ViolationClient;
import com.grad.course_management_services.dao.ChapterRepository;
import com.grad.course_management_services.dto.QuestionDTO;
import com.grad.course_management_services.dto.QuizDTO;
import com.grad.course_management_services.dto.ViolationDTO;
import com.grad.course_management_services.dto.QuizAttemptDTO;
import com.grad.course_management_services.dto.QuizAttemptResponseDTO;
import com.grad.course_management_services.models.Quiz;
import com.grad.course_management_services.models.Questions.MCQQuestion;
import com.grad.course_management_services.models.Questions.Question;
import com.grad.course_management_services.models.Questions.TrueFalseQuestion;
import com.grad.course_management_services.models.Chapter;
import com.grad.course_management_services.models.QuizAttempt;
import com.grad.course_management_services.repositories.QuizAttemptRepository;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;


    // Convert Quiz to QuizDTO
    private QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setChapterId(quiz.getChapter().getId());
        dto.setTotalGrade(quiz.getTotalGrade());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setMaxAttempts(quiz.getMaxAttempts());
        dto.setQuestions(getQuestionsByQuiz(quiz.getId()));
        return dto;
    }

    // Convert QuizDTO to Quiz
    private Quiz convertToEntity(QuizDTO dto) {
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());
        quiz.setTimeLimit(dto.getTimeLimit());
        quiz.setMaxAttempts(dto.getMaxAttempts() != null ? dto.getMaxAttempts() : 3); // Default to 3 if not specified
        quiz.setTotalGrade(0.0); // Initialize total grade to 0
        
        // Set the chapter relationship
        Chapter chapter = chapterRepository.findById(dto.getChapterId())
            .orElseThrow(() -> new RuntimeException("Chapter not found with id: " + dto.getChapterId()));
        quiz.setChapter(chapter);
        
        return quiz;
    }

    // . Create a new quiz
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        Quiz quiz = convertToEntity(quizDTO);
        quiz.setTotalGrade(0.0); // Ensure total grade is set to 0 initially
        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz);
    }

    // . Get all quizzes
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // . Get a quiz by ID
    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return convertToDTO(quiz);
    }

    // . Get quizzes by chapter
    public List<QuizDTO> getQuizzesByChapter(Long chapterId) {
        return quizRepository.findByChapterId(chapterId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // . Update a quiz
    public QuizDTO updateQuiz(Long quizId, QuizDTO updatedQuizDTO) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Update basic quiz properties
        existingQuiz.setTitle(updatedQuizDTO.getTitle());
        existingQuiz.setTimeLimit(updatedQuizDTO.getTimeLimit());
        existingQuiz.setMaxAttempts(updatedQuizDTO.getMaxAttempts());
        
        // Update chapter if changed
        if (!existingQuiz.getChapter().getId().equals(updatedQuizDTO.getChapterId())) {
            Chapter newChapter = chapterRepository.findById(updatedQuizDTO.getChapterId())
                .orElseThrow(() -> new RuntimeException("Chapter not found with id: " + updatedQuizDTO.getChapterId()));
            existingQuiz.setChapter(newChapter);
        }
        
        // Handle questions
        // First, remove questions that are no longer in the updated quiz
        List<Question> existingQuestions = questionRepository.findByQuizId(quizId);
        List<Long> updatedQuestionIds = updatedQuizDTO.getQuestions().stream()
            .map(QuestionDTO::getId)
            .filter(id -> id != null)
            .collect(Collectors.toList());
        
        existingQuestions.stream()
            .filter(q -> !updatedQuestionIds.contains(q.getId()))
            .forEach(questionRepository::delete);
        
        // Update existing questions and add new ones
        List<Question> updatedQuestions = new ArrayList<>();
        for (QuestionDTO questionDTO : updatedQuizDTO.getQuestions()) {
            Question question;
            if (questionDTO.getId() != null) {
                // Update existing question
                question = questionRepository.findById(questionDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionDTO.getId()));
                question.setText(questionDTO.getText());
                question.setGrade(questionDTO.getGrade());
                
                if (question instanceof MCQQuestion && "MCQ".equals(questionDTO.getQuestionType())) {
                    MCQQuestion mcqQuestion = (MCQQuestion) question;
                    mcqQuestion.setCorrectAnswer(questionDTO.getCorrectAnswer());
                    mcqQuestion.setOptions(String.join(",", questionDTO.getOptions()));
                } else if (question instanceof TrueFalseQuestion && "TRUE_FALSE".equals(questionDTO.getQuestionType())) {
                    TrueFalseQuestion tfQuestion = (TrueFalseQuestion) question;
                    tfQuestion.setCorrectAnswer(Boolean.parseBoolean(questionDTO.getCorrectAnswer()));
                }
                questionRepository.save(question);
            } else {
                // Create new question
                questionDTO.setQuizId(quizId); // Set the quiz ID for the new question
                Question newQuestion = createQuestionFromDTO(questionDTO, existingQuiz);
                question = questionRepository.save(newQuestion);
            }
            updatedQuestions.add(question);
        }
        
        // Update total grade
        double totalGrade = updatedQuestions.stream()
            .mapToDouble(Question::getGrade)
            .sum();
        existingQuiz.setTotalGrade(totalGrade);
        
        // Save the updated quiz
        Quiz savedQuiz = quizRepository.save(existingQuiz);
        
        // Return the updated quiz with all its questions
        return convertToDTO(savedQuiz);
    }

    // Helper method to create a new Question from DTO
    private Question createQuestionFromDTO(QuestionDTO dto, Quiz quiz) {
        Question question;
        if ("MCQ".equals(dto.getQuestionType())) {
            question = new MCQQuestion(
                dto.getText(),
                dto.getGrade(),
                quiz,
                dto.getCorrectAnswer(),
                String.join(",", dto.getOptions()),
                quiz.getQuestions().size() + 1
            );
        } else if ("TRUE_FALSE".equals(dto.getQuestionType())) {
            question = new TrueFalseQuestion(
                dto.getText(),
                dto.getGrade(),
                quiz,
                Boolean.parseBoolean(dto.getCorrectAnswer()),
                quiz.getQuestions().size() + 1
            );
        } else {
            throw new IllegalArgumentException("Invalid question type: " + dto.getQuestionType());
        }
        return question;
    }

    // . Delete a quiz
    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }

    // . Get all questions for a quiz
    public List<QuestionDTO> getQuestionsByQuiz(Long quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        
        return questions.stream()
                .map(this::createQuestionDTO)
                .collect(Collectors.toList());
    }

    // . Delete a question
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        Long quizId = question.getQuiz().getId();
        questionRepository.deleteById(questionId);

        // Update total grade after question deletion
        updateTotalGrade(quizId);
    }

    // . Update total grade of a quiz
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

    // . Get MCQ questions by quiz ID
    public List<MCQQuestion> getMCQQuestionsByQuizId(Long quizId) {
        return questionRepository.findMCQQuestionsByQuizId(quizId);
    }

    // . Get True/False questions by quiz ID
    public List<TrueFalseQuestion> getTrueFalseQuestionsByQuizId(Long quizId) {
        return questionRepository.findTrueFalseQuestionsByQuizId(quizId);
    }

    // . Get a question by ID
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id " + id));
    }

    // . Update a question
    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = getQuestionById(id);
        question.setText(questionDetails.getText());
        question.setGrade(questionDetails.getGrade());
        Question updatedQuestion = questionRepository.save(question);
        
        // Update quiz's total grade after updating a question
        updateTotalGrade(question.getQuiz().getId());
        
        return updatedQuestion;
    }

    // . Create a new question
    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        Question question = null;
        Quiz quiz = quizRepository.findById(questionDTO.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if ("MCQ".equals(questionDTO.getQuestionType())) {
            question = new MCQQuestion(
                questionDTO.getText(),
                questionDTO.getGrade(),
                quiz,
                questionDTO.getCorrectAnswer(),
                String.join(",", questionDTO.getOptions()),
                quiz.getQuestions().size() + 1
            );
        } else if ("TRUE_FALSE".equals(questionDTO.getQuestionType())) {
            question = new TrueFalseQuestion(
                questionDTO.getText(),
                questionDTO.getGrade(),
                quiz,
                Boolean.parseBoolean(questionDTO.getCorrectAnswer()),
                quiz.getQuestions().size() + 1
            );
        }

        // Save the question first
        Question savedQuestion = questionRepository.save(question);
        
        // Add the question to the quiz's questions list
        quiz.getQuestions().add(savedQuestion);
        
        // Calculate and update the total grade
        double totalGrade = quiz.getQuestions().stream()
            .mapToDouble(Question::getGrade)
            .sum();
        quiz.setTotalGrade(totalGrade);
        
        // Save the updated quiz
        quizRepository.save(quiz);
        
        return createQuestionDTO(savedQuestion);
    }

    // Get quiz attempts for a user
    public List<QuizAttemptDTO> getQuizAttemptsByUser(Long userId) {
        return quizAttemptRepository.findByUserId(userId)
            .stream()
            .map(this::convertAttemptToDTO)
            .collect(Collectors.toList());
    }

    // Get quiz attempts for a specific quiz
    public List<QuizAttemptDTO> getQuizAttemptsByQuiz(Long quizId) {
        return quizAttemptRepository.findByQuizId(quizId)
            .stream()
            .map(this::convertAttemptToDTO)
            .collect(Collectors.toList());
    }

    // Record a new quiz attempt
    public QuizAttemptDTO recordQuizAttempt(Long quizId, Long userId, Double score) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Get previous attempts for this quiz and user
        List<QuizAttempt> previousAttempts = quizAttemptRepository.findByQuizIdAndUserId(quizId, userId);
        
        // Create new attempt
        QuizAttempt attempt = new QuizAttempt(quiz, userId);
        attempt.setScore(score);
        attempt.setAttemptNumber(previousAttempts.size() + 1);
        attempt.setPassed(score >= 50); // Assuming 50% is passing grade

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        return convertAttemptToDTO(savedAttempt);
    }

    // Get number of attempts for a quiz by a user
    public Integer getNumberOfAttempts(Long quizId, Long userId) {
        return quizAttemptRepository.findByQuizIdAndUserId(quizId, userId).size();
    }

    private QuizAttemptDTO convertAttemptToDTO(QuizAttempt attempt) {
        return new QuizAttemptDTO(
            attempt.getId(),
            attempt.getQuiz().getId(),
            attempt.getUserId(),
            attempt.getScore(),
            attempt.getAttemptDate(),
            attempt.getAttemptNumber(),
            attempt.getPassed()
        );
    }
    public List<QuizDTO> getQuizzesByCourse(Long courseId) {
        List<Chapter> chapters = chapterRepository.findByCourseId(courseId);
    
        List<Quiz> allQuizzes = new ArrayList<>();
        for (Chapter chapter : chapters) {
            List<Quiz> quizzes = quizRepository.findByChapterId(chapter.getId());
            allQuizzes.addAll(quizzes);
        }
    
        return allQuizzes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public List<QuizAttemptDTO> getAttemptsByQuizIdAndUserId(Long quizId, Long userId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdAndUserId(quizId, userId);
        
        return attempts.stream().map(this::convertAttemptToDTO).toList();
    }
    
    @Autowired
    private ViolationClient violationClient;
    public QuizAttemptResponseDTO getQuizAttemptWithViolations(QuizAttempt attempt) {
        QuizAttemptResponseDTO dto = new QuizAttemptResponseDTO();
        dto.setId(attempt.getId());
        dto.setUserId(attempt.getUserId());
        dto.setQuizId(attempt.getQuiz().getId());
        dto.setScore(attempt.getScore());
    
        Long courseId = attempt.getQuiz().getChapter().getCourse().getId();
    
        List<ViolationDTO> allViolations = violationClient.getViolationsByUserAndCourse(
            attempt.getUserId(), courseId);
    
        List<ViolationDTO> filtered = allViolations.stream()
                .filter(v -> v.getQuizId().equals(attempt.getQuiz().getId()))
                .toList();
    
        dto.setViolations(filtered);
        return dto;
    }
    public List<QuizAttemptResponseDTO> getUserQuizAttemptsWithViolationsByCourse(Long userId, Long courseId) {
        List<Chapter> chapters = chapterRepository.findByCourseId(courseId);
        List<QuizAttemptResponseDTO> responses = new ArrayList<>();
    
        for (Chapter chapter : chapters) {
            List<Quiz> quizzes = quizRepository.findByChapterId(chapter.getId());
    
            for (Quiz quiz : quizzes) {
                List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdAndUserId(quiz.getId(), userId);
    
                for (QuizAttempt attempt : attempts) {
                    // reuse your existing method
                    QuizAttemptResponseDTO dto = getQuizAttemptWithViolations(attempt);
                    responses.add(dto);
                }
            }
        }
    
        return responses;
    }
    
}


