package com.javalab.student.repository;

import com.javalab.student.entity.SurveyTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 설문 주제(SurveyTopic) Repository
 * SurveyTopic 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */
@Repository
public interface SurveyTopicRepository extends JpaRepository<SurveyTopic, Long> {

    /**
     * ✅ 특정 설문(surveyId)에 속한 주제 조회
     */
    List<SurveyTopic> findBySurvey_SurveyId(Long surveyId);
}
