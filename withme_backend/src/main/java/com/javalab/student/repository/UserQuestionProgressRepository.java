package com.javalab.student.repository;

import com.javalab.student.entity.UserQuestionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 유저 문진 진행 Repository
 * UserQuestionProgress 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface UserQuestionProgressRepository extends JpaRepository<UserQuestionProgress, Long> {
}
