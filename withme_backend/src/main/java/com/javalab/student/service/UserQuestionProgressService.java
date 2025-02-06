package com.javalab.student.service;

import com.javalab.student.entity.UserQuestionProgress;
import com.javalab.student.entity.UserQuestionProgress.UserQuestionProgressId;
import com.javalab.student.repository.UserQuestionProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 📌 문진 진행 상태 서비스
 * - userId 기반 문진 진행 상태 조회 및 관리
 */
@Service
public class UserQuestionProgressService {

    private final UserQuestionProgressRepository userQuestionProgressRepository;

    @Autowired
    public UserQuestionProgressService(UserQuestionProgressRepository userQuestionProgressRepository) {
        this.userQuestionProgressRepository = userQuestionProgressRepository;
    }

    /**
     * ✅ 특정 userId 기반 문진 진행 상태 조회
     */
    public List<UserQuestionProgress> getUserQuestionProgress(Long userId) {
        return userQuestionProgressRepository.findAllByMember_UserId(userId);
    }

    /**
     * ✅ 문진 진행 상태 저장
     */
    public UserQuestionProgress createUserQuestionProgress(UserQuestionProgress userQuestionProgress) {
        return userQuestionProgressRepository.save(userQuestionProgress);
    }

    /**
     * ✅ 특정 userId, questionnaireId, questionId 기반 문진 진행 상태 삭제
     */
    public void deleteUserQuestionProgress(Long userId, Long questionnaireId, Long questionId) {
        UserQuestionProgressId id = new UserQuestionProgressId(userId, questionnaireId, questionId);
        userQuestionProgressRepository.deleteById(id);
    }
}
