package com.javalab.student.service;

import com.javalab.student.entity.ExpertAnswer;
import com.javalab.student.repository.ExpertAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 전문가 답변 서비스
 * 전문가 답변에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */

@Service
public class ExpertAnswerService {

    private final ExpertAnswerRepository expertAnswerRepository;

    @Autowired
    public ExpertAnswerService(ExpertAnswerRepository expertAnswerRepository) {
        this.expertAnswerRepository = expertAnswerRepository;
    }

    /**
     * 모든 전문가 답변 조회
     */
    public List<ExpertAnswer> getAllExpertAnswers() {
        return expertAnswerRepository.findAll();
    }

    /**
     * 특정 전문가 답변 조회 (ID 기반)
     */
    public Optional<ExpertAnswer> getExpertAnswerById(Long answerId) {
        return expertAnswerRepository.findById(answerId);
    }

    /**
     * 특정 유저 ID 기반 전문가 답변 조회
     */
    public List<ExpertAnswer> getExpertAnswersByUserId(Long userId) {
        return expertAnswerRepository.findAllByUserId(userId);
    }

    /**
     * 새로운 전문가 답변 생성
     */
    public ExpertAnswer createExpertAnswer(ExpertAnswer expertAnswer) {
        return expertAnswerRepository.save(expertAnswer);
    }

    /**
     * 전문가 답변 삭제
     */
    public void deleteExpertAnswer(Long answerId) {
        expertAnswerRepository.deleteById(answerId);
    }
}