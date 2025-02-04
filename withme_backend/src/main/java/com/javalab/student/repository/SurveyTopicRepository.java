package com.javalab.student.repository;

import com.javalab.student.entity.SurveyTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 설문주제 Repository
 * SurveyTopic 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface SurveyTopicRepository extends JpaRepository<SurveyTopic, Long> {
}
