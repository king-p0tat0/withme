package com.javalab.student.repository;

import com.javalab.student.entity.ExpertQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 전문가 질문 Repository
 * ExpertQuestion 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface ExpertQuestionRepository extends JpaRepository<ExpertQuestion, Long> {
}
