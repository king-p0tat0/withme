package com.javalab.student.repository;

import com.javalab.student.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 설문 repository
 *  survey 엔티티에 대한 CRUD 작업을 처리하는 리포지 토리
 */

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {

}
