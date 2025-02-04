package com.javalab.student.repository;

import com.javalab.student.entity.UserQuestionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 유저 문진 진행 Repository
 * UserQuestionProgress 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface UserQuestionProgressRepository extends JpaRepository<UserQuestionProgress, Long> {
    // 유저 ID를 기준으로 문진 진행 상태 목록을 조회하는 메소드
    List<UserQuestionProgress> findAllByUserId(String userId);

    // 유저 ID, 문진 ID, 질문 ID를 기준으로 문진 진행 상태 삭제하는 메소드
    void deleteByUserIdAndQuestionnaireIdAndQuestionId(String userId, Long questionnaireId, Long questionId);

}
