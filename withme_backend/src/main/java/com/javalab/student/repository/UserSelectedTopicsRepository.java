package com.javalab.student.repository;

import com.javalab.student.entity.UserSelectedTopics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSelectedTopicsRepository extends JpaRepository<UserSelectedTopics, UserSelectedTopics.UserSelectedTopicsId> {

    /**
     * ✅ 특정 회원(userId)이 선택한 모든 주제 조회
     */
    List<UserSelectedTopics> findAllByMember_Id(Long userId);

    /**
     * ✅ 특정 회원(userId)이 특정 주제(topicId)를 선택했는지 조회
     */
    boolean existsByMember_IdAndSurveyTopic_TopicId(Long userId, Long topicId);
}
