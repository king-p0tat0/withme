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

    List<Questionnaire> findAllByUser_Id(Long userId);

    Optional<Questionnaire> findTopByUser_IdAndSurveyTypeOrderByCreatedAtDesc(Long userId, String surveyType);
}

