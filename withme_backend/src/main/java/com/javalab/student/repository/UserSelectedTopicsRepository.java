package com.javalab.student.repository;

import com.javalab.student.entity.UserSelectedTopics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 유저가 선택한 주제 Repository
 * UserSelectedTopics 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface UserSelectedTopicsRepository extends JpaRepository<UserSelectedTopics, Long> {
}
