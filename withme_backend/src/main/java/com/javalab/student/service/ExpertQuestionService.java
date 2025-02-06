package com.javalab.student.service;

import com.javalab.student.entity.ExpertQuestion;
import com.javalab.student.repository.ExpertQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 전문가 질문 서비스
 * 전문가 질문에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */

@Service
public class ExpertQuestionService {

    private final ExpertQuestionRepository expertQuestionRepository;

    @Autowired
    public ExpertQuestionService(ExpertQuestionRepository expertQuestionRepository) {
        this.expertQuestionRepository = expertQuestionRepository;
    }

    /**
     * 모든 전문가 질문 조회
     */
    public List<ExpertQuestion> getAllExpertQuestions() {
        return expertQuestionRepository.findAll();
    }

    /**
     * 전문가 질문 ID 로 질문 조회
     */
    public Optional<ExpertQuestion> getExpertQuestionById(Long expertQuestionId) {
        return expertQuestionRepository.findById(expertQuestionId);
    }

    /**
     * 특정 유저 ID 기반 전문가 질문 조회
     */
    public List<ExpertQuestion> getExpertQuestionsByUserId(Long userId) {
        return expertQuestionRepository.findAllByMember_UserId(userId);
    }

    /**
     * 새로운 전문가 질문 생성
     */
    public ExpertQuestion createExpertQuestion(ExpertQuestion expertQuestion) {
        return expertQuestionRepository.save(expertQuestion);
    }

    /**
     * 전문가 질문 삭제
     */
    public void deleteExpertQuestion(Long expertQuestionId) {
        expertQuestionRepository.deleteById(expertQuestionId);
    }
}