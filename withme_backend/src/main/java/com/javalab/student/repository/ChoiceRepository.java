package com.javalab.student.repository;

import com.javalab.student.entity.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 선택지 Repository
 * Choice 앤티티에 대한 CRUD 작업을 처리하는 리포지토리
 */

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
}
