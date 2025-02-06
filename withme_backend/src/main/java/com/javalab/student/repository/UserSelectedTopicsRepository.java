package com.javalab.student.repository;

import com.javalab.student.entity.UserSelectedTopics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 📌 유저가 선택한 주제 Repository
 * - userId 기반으로 선택한 주제 관리
 */
@Repository
public interface UserSelectedTopicsRepository extends JpaRepository<UserSelectedTopics, String> {

    /**
     * ✅ 특정 userId 기반 선택한 주제 목록 조회
     */
    List<UserSelectedTopics> findAllByUserId(String userId);

    /**
     * ✅ 특정 userId로 가장 첫 번째 선택한 주제 하나만 조회 (필요할 경우 사용)
     */
    Optional<UserSelectedTopics> findFirstByUserId(String userId);
}
