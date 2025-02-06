package com.javalab.student.service;

import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.repository.SurveyTopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 설문 주제(SurveyTopic) 서비스
 * 설문 주제에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class SurveyTopicService {

    private final SurveyTopicRepository surveyTopicRepository;

    @Autowired
    public SurveyTopicService(SurveyTopicRepository surveyTopicRepository) {
        this.surveyTopicRepository = surveyTopicRepository;
    }

    /**
     * ✅ 모든 설문 주제 조회
     */
    public List<SurveyTopic> getAllTopics() {
        return surveyTopicRepository.findAll();
    }

    /**
     * ✅ 특정 주제 ID로 조회
     */
    public Optional<SurveyTopic> getTopicById(Long topicId) {
        return surveyTopicRepository.findById(topicId);
    }

    /**
     * ✅ 특정 설문(surveyId)에 속한 유료 문진(PAID) 주제 목록 조회
     */
    public List<SurveyTopic> getPaidTopics(Long surveyId) {
        return surveyTopicRepository.findBySurvey_SurveyId(surveyId);
    }

    /**
     * ✅ 새로운 설문 주제 생성
     */
    public SurveyTopic createTopic(SurveyTopic surveyTopic) {
        return surveyTopicRepository.save(surveyTopic);
    }

    /**
     * ✅ 설문 주제 삭제
     */
    public void deleteTopic(Long topicId) {
        surveyTopicRepository.deleteById(topicId);
    }
}
