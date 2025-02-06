package com.javalab.student.service;

import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.repository.SurveyTopicRepository;
import com.javalab.student.repository.UserSelectedTopicsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 📌 유저가 선택한 주제 서비스
 * - userId 기반 주제 저장 및 조회
 */
@Service
public class UserSelectedTopicsService {

    private final UserSelectedTopicsRepository userSelectedTopicsRepository;
    private final SurveyTopicRepository surveyTopicRepository;

    @Autowired
    public UserSelectedTopicsService(UserSelectedTopicsRepository userSelectedTopicsRepository,
                                     SurveyTopicRepository surveyTopicRepository) {
        this.userSelectedTopicsRepository = userSelectedTopicsRepository;
        this.surveyTopicRepository = surveyTopicRepository;
    }

    /**
     * ✅ 특정 userId 기반 선택한 주제 조회
     */
    public List<UserSelectedTopics> getSelectedTopicsByUserId(String userId) {
        return userSelectedTopicsRepository.findAllByUserId(userId);
    }

    /**
     * ✅ 선택한 주제 저장
     */
    public UserSelectedTopics saveUserSelectedTopic(String userId, Long topicId) {
        SurveyTopic surveyTopic = surveyTopicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주제가 존재하지 않습니다: " + topicId));

        UserSelectedTopics userSelectedTopics = UserSelectedTopics.builder()
                .userId(userId)
                .surveyTopic(surveyTopic)
                .build();

        return userSelectedTopicsRepository.save(userSelectedTopics);
    }

    /**
     * ✅ 특정 userId와 주제 삭제
     */
    public void deleteUserSelectedTopic(String userId, Long topicId) {
        userSelectedTopicsRepository.deleteById(userId);
    }
}