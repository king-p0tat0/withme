package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 전문가 질문 엔티티
 * 전문가가 문진에 대해 질문을 할수 있는 정보를 저장하는 테이블과 매핑
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "expert_question")

public class ExpertQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expertQuestionId; // 전문가 질문 ID

    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire; // 해당 문지 ID

    @Lob
    private String questionText; // 질문 내용

    private LocalDateTime createdAt; // 질문 작성일
}
