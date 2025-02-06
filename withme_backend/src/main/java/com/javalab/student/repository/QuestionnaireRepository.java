package com.javalab.student.repository;

import com.javalab.student.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 문진(Questionnaire) Repository
 */
@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    List<Questionnaire> findAllByUser_UserId(Long userId);
}