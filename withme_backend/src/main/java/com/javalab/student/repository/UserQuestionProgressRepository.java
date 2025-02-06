package com.javalab.student.repository;

import com.javalab.student.entity.UserQuestionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 📌 문진 진행 상태 Repository
 * - userId 기반 문진 진행 상태 조회 및 관리
 */
@Repository
public interface UserQuestionProgressRepository extends JpaRepository<UserQuestionProgress, Long> {

    /**
     * ✅ 특정 userId 기반 진행 상태 조회
     */
    List<UserQuestionProgress> findAllByUserId(String userId);

    /**
     * ✅ 특정 userId + questionnaireId + questionId 기반 데이터 삭제
     */
    void deleteByUserIdAndQuestionnaire_QuestionnaireIdAndQuestion_QuestionId(
            String userId, Long questionnaireId, Long questionId
    );
}