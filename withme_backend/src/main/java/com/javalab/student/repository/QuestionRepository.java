package com.javalab.student.repository;

import com.javalab.student.entity.Question;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 질문 Repository
 * Question 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
