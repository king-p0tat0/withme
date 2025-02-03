package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 질문 엔티티
 * 설문에 포함된 각 질문에 대한 정보를 저장하는 테이블과 매핑
 * 질문내용, 순서, 질문 유형및 필수 응답 여부를 포함
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
    private Long questionId; // 질문 ID

    private Integer seq; // 문항 순서

    @Lob
    private String questionText; // 질문 내용

    @Enumerated(EnumType.STRING)
    private QuestionType questionType; // 질문 유형(SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, RATING)

    private Boolean isRequired; // 필수 응답 여부

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private SurveyTopic surveyTopic; // 해당 질문이 속한 주제

    public enum QuestionType {
        SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, RATING
    }

}
