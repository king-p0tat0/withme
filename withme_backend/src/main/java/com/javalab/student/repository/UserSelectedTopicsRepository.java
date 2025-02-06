package com.javalab.student.repository;

import com.javalab.student.entity.UserSelectedTopics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 📌 사용자 선택 주제 레포지토리 (UserSelectedTopicsRepository)
 * - 특정 사용자의 선택한 주제 목록 조회
 * - 특정 userId & topicId 기반 데이터 삭제
 */
@Repository
public interface UserSelectedTopicsRepository extends JpaRepository<UserSelectedTopics, UserSelectedTopics.UserSelectedTopicsId> {

    /**
     * ✅ 특정 userId 기반 선택한 주제 목록 조회
     */
    List<UserSelectedTopics> findAllByMember_UserId(Long userId);

    /**
     * ✅ 특정 userId와 topicId를 기반으로 데이터 삭제
     */
    void deleteByMember_UserIdAndSurveyTopic_TopicId(Long userId, Long topicId);
}
