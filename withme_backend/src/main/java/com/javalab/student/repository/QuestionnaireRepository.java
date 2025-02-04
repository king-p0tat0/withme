package com.javalab.student.repository;

import com.javalab.student.entity.Questionnaire;
import org.hibernate.validator.constraints.pl.REGON;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 문진 Repository
 * Questionnaire 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
}
