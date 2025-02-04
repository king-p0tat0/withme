package com.javalab.student.service;

import com.javalab.student.entity.Question;
import com.javalab.student.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 질문 서비스
 * 설문에 포함된 각 질문에 대한 비지니스 로직을 처리하는 서비스 클래스
 */

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    /**
     * 모든 질문 조회
     */
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     *  질문 ID 로 질문 조회
     */
    public Optional<Question> getQuestionById(Long questionId) {
        return questionRepository.findById(questionId);
    }

    /**
     * 새로운 질문 생성
     */
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    /**
     * 질문 삭제
     */
    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

}
