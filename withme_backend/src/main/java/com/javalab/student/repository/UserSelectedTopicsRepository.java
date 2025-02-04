package com.javalab.student.repository;

import com.javalab.student.entity.UserSelectedTopics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 유저가 선택한 주제 Repository
 * UserSelectedTopics 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */
@Repository
public interface UserSelectedTopicsRepository extends JpaRepository<UserSelectedTopics, Long> {

    // 유저 ID로 선택한 주제 목록을 조회하는 메소드
    List<UserSelectedTopics> findAllByUserId(String userId);

    // 유저 ID와 주제 ID로 선택한 주제를 삭제하는 메소드
    void deleteByUserIdAndTopicId(String userId, Long topicId);
}
