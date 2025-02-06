package com.javalab.student.repository;

import com.javalab.student.entity.UserQuestionProgress;
import com.javalab.student.entity.UserQuestionProgress.UserQuestionProgressId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuestionProgressRepository extends JpaRepository<UserQuestionProgress, UserQuestionProgressId> {

    /**
     * ✅ 특정 userId 기반 진행 상태 조회
     */
    List<UserQuestionProgress> findAllByMember_UserId(Long userId);

    /**
     * ✅ 특정 userId, questionnaireId, questionId를 기반으로 데이터 삭제
     */
    void deleteById(UserQuestionProgressId id);
}
