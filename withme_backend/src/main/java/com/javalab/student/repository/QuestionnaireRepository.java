package com.javalab.student.repository;

import com.javalab.student.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    /**
     * ✅ 특정 유저 ID로 문진 조회
     */
    List<Questionnaire> findAllByUser_Id(Long userId);  // ✅ `User_Id`로 수정
}
