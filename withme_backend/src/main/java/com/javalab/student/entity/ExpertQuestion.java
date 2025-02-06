package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDateTime;

/**
 * 전문가 질문 엔티티
 * 전문가가 문진에 대해 질문을 할 수 있는 정보를 저장하는 테이블과 매핑
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
    @Column(name = "expert_question_id")
    private Long expertQuestionId; // 전문가 질문 ID

    @ManyToOne
    @JoinColumn(name = "questionnaire_id", nullable = false)
    private Questionnaire questionnaire; // 해당 문진 ID

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
//    private User user; // 질문을 등록한 사용자 ID

    @Lob
    @Column(name = "question_text", nullable = false)
    private String questionText; // 질문 내용

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 질문 작성일
}