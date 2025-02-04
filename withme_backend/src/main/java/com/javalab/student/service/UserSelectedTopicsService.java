package com.javalab.student.service;

import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.repository.UserSelectedTopicsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 유저가 선택한 주제 서비스
 * 유저가 선택한 주제에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */

@Service
public class UserSelectedTopicsService {

    private final UserSelectedTopicsRepository userSelectedTopicsRepository;

    @Autowired
    public UserSelectedTopicsService(UserSelectedTopicsRepository userSelectedTopicsRepository){
        this. userSelectedTopicsRepository = userSelectedTopicsRepository;
    }

    /**
     * 유저가 선택한 주제 조회
     */
    public List<UserSelectedTopics> getUserSelectedTopics(String userId) {
        return userSelectedTopicsRepository.findAllByUserId(userId);
    }

    /**
     * 유저가 선택한 주제 생성
     */
    public UserSelectedTopics createUserSelectedTopics(UserSelectedTopics userSelectedTopics){
        return userSelectedTopicsRepository.save(userSelectedTopics);
    }

    /**
     * 유저가 선택한 주제 삭제
     */
    public void deleteUserSelectedTopics(String userId, Long topicId) {
        userSelectedTopicsRepository.deleteByUserIdAndTopicId(userId, topicId);
    }
}
