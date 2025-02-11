package com.javalab.student.repository;

import com.javalab.student.entity.Question;
import com.javalab.student.entity.SurveyTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 질문 Repository
 * Question 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * ✅ 특정 설문 주제에 속한 질문 조회
     */
    List<Question> findBySurveyTopic_TopicId(Long topicId);

    /**
     * ✅ 특정 유저가 선택한 주제에 속한 질문 조회 (유료 회원 문진 진행)
     */
    List<Question> findBySurveyTopicIn(List<SurveyTopic> topics);
}
