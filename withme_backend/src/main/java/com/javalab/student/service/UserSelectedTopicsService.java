package com.javalab.student.service;

import com.javalab.student.entity.Member;
import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.entity.UserSelectedTopics.UserSelectedTopicsId;
import com.javalab.student.repository.MemberRepository;
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
    private final MemberRepository memberRepository;

    @Autowired
    public UserSelectedTopicsService(UserSelectedTopicsRepository userSelectedTopicsRepository,
                                     SurveyTopicRepository surveyTopicRepository,
                                     MemberRepository memberRepository) {
        this.userSelectedTopicsRepository = userSelectedTopicsRepository;
        this.surveyTopicRepository = surveyTopicRepository;
        this.memberRepository = memberRepository;
    }

    /**
     * ✅ 특정 userId 기반 선택한 주제 조회
     */
    public List<UserSelectedTopics> getSelectedTopicsByUserId(Long userId) {
        return userSelectedTopicsRepository.findAllByMember_UserId(userId);
    }

    /**
     * ✅ 선택한 주제 저장
     */
    public UserSelectedTopics saveUserSelectedTopic(Long userId, Long topicId) {
        // 사용자 정보 확인
        Member user = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다: " + userId));

        // 설문 주제 정보 확인
        SurveyTopic surveyTopic = surveyTopicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주제가 존재하지 않습니다: " + topicId));

        // 복합 키 생성
        UserSelectedTopicsId id = new UserSelectedTopicsId(userId, topicId);

        // 기존 데이터 확인 후 중복 저장 방지
        if (userSelectedTopicsRepository.existsById(id)) {
            throw new IllegalStateException("이미 선택한 주제입니다: userId=" + userId + ", topicId=" + topicId);
        }

        // 새로운 UserSelectedTopics 생성
        UserSelectedTopics userSelectedTopics = new UserSelectedTopics(user, surveyTopic);

        return userSelectedTopicsRepository.save(userSelectedTopics);
    }

    /**
     * ✅ 특정 userId와 topicId 기반으로 선택한 주제 삭제
     */
    public void deleteUserSelectedTopic(Long userId, Long topicId) {
        UserSelectedTopicsId id = new UserSelectedTopicsId(userId, topicId);

        if (!userSelectedTopicsRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 데이터가 존재하지 않습니다: userId=" + userId + ", topicId=" + topicId);
        }

        userSelectedTopicsRepository.deleteById(id);
    }
}
