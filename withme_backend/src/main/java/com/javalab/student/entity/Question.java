package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 질문 엔티티
 * 설문에 포함된 각 질문에 대한 정보를 저장하는 테이블과 매핑
 * 질문 내용, 순서, 질문 유형 및 필수 응답 여부를 포함
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId; // 질문 ID

    @Column(name = "seq", nullable = false)
    private Integer seq; // 문항 순서

    @Lob
    @Column(name = "question_text", nullable = false)
    private String questionText; // 질문 내용

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType; // 질문 유형

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired; // 필수 응답 여부

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private SurveyTopic surveyTopic; // 해당 질문이 속한 주제

    public enum QuestionType {
        SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, RATING
    }
}
