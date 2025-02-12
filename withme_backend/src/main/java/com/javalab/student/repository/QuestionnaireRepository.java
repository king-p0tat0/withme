package com.javalab.student.repository;

import com.javalab.student.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 📌 문진(Questionnaire) Repository
 * - 특정 유저의 문진을 조회하는 메서드 제공
 */
@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {

    /**
     * ✅ 특정 사용자 ID로 모든 문진 조회
     */
    List<Questionnaire> findAllByUser_Id(Long userId);

    /**
     * ✅ 특정 사용자 ID로 특정 유형(FREE/PAID) 문진 조회
     */
    List<Questionnaire> findAllByUser_IdAndSurveyType(Long userId, String surveyType);

    /**
     * ✅ 특정 사용자의 최신 무료 문진 조회 (최신순)
     */
    Optional<Questionnaire> findTopByUser_IdAndSurveyTypeOrderByCreatedAtDesc(Long userId, String surveyType);
}

