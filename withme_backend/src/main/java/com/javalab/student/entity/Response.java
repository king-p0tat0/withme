package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 응답 엔티티
 * 설문에 대한 유저의 응답을 저장하는 테이블과 매핑
 * 설문, 질문, 선택지 간의 관계를 저장
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "response")
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long responseId;  // 응답 ID

    @ManyToOne
    @JoinColumn(name = "survey_id")
    private Survey survey;  // 해당 응답이 속한 설문

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;  // 해당 응답이 속한 질문

    @ManyToOne
    @JoinColumn(name = "choice_id")
    private Choice choice;  // 유저가 선택한 선택지
}
