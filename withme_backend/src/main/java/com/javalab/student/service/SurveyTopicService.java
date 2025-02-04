package com.javalab.student.service;

import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.repository.SurveyTopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 설문 주제 서비스
 * 설문 주제에 대한 비지니스 로직을 처리하는 클래스
 */

@Service
public class SurveyTopicService {

    private final SurveyTopicRepository surveyTopicRepository;

    @Autowired
    public SurveyTopicService(SurveyTopicRepository surveyTopicRepository) {
        this.surveyTopicRepository = surveyTopicRepository;
    }

    /**
     * 모든 설문 주제 조회
     */
    public List<SurveyTopic> getAllTopics() {
        return surveyTopicRepository.findAll();
    }

    /**
     * 설문 주제 ID로 설문 주제 조회
     */
    public Optional<SurveyTopic> getTopicById(Long topicId) {
        return surveyTopicRepository.findById(topicId);
    }

    /**
     * 새로운 설문 주체 생성
     */
    public SurveyTopic createTopic(SurveyTopic surveyTopic){
        return surveyTopicRepository.save(surveyTopic);
    }

    /**
     * 설문 주제 삭제
     */
    public void deleteTopic(Long topicId) {
        surveyTopicRepository.deleteById(topicId);
    }

}
