package com.javalab.student.service;

import com.javalab.student.entity.UserQuestionProgress;
import com.javalab.student.repository.UserQuestionProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 유저 문진 진행 서비스
 * 유저 문진 진행 상태를 처리하는 서비스 클래스
 */

@Service
public class UserQuestionProgressService {

    private final UserQuestionProgressRepository userQuestionProgressRepository;

    @Autowired
    public UserQuestionProgressService(UserQuestionProgressRepository userQuestionProgressRepository){
        this.userQuestionProgressRepository = userQuestionProgressRepository;
    }

    /**
     * 유저 문진 진행 상태 조회
     */
    public List<UserQuestionProgress> getUserQuestionProgress(String userId) {
        return userQuestionProgressRepository.findAllByUserId(userId);
    }

    /**
     * 유저 문진 진행 상태 생성
     */
    public UserQuestionProgress createUserQuestionProgress(UserQuestionProgress userQuestionProgress){
        return userQuestionProgressRepository.save(userQuestionProgress);
    }

    /**
     * 유저 문진 진행 상태 삭제
     */
    public void deleteUserQuestionProgress(String userId, Long questionnaireId, Long questionId) {
        userQuestionProgressRepository.deleteByUserIdAndQuestionnaireIdAndQuestionId(userId, questionnaireId, questionId);
    }
}
