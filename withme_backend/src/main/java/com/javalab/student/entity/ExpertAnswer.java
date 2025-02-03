package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 전문가 답변
 * 전문가가 제공한 답변에 대한 정보를 저장하는 테이블과 매핑
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "expert_answer")

public class ExpertAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId; // 답변 ID

    @ManyToOne
    @JoinColumn(name = "expert_question_id")
    private ExpertQuestion expertQuestion; // 전문가 질문 ID

    private String doctorId; // 전문가 ID

    @Lob
    private String answerText; // 답변 내용

    private LocalDateTime createdAt; // 답변 작성일

}
