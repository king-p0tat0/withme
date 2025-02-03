package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 선택지 엔티티
 * 각 질문에 대한 선택지를 저장하는 테이블과 매핑
 * 선택지 텍스트와 점수등을 포함
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "choice")

public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long choiceId; // 선택지 ID

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question; // 해당 선택지가 속한 질문

    private String choiceText; // 선택지 텍스트

    private Integer score; // 선택지 점수


}
