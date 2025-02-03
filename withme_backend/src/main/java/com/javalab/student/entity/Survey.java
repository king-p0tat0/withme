package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 설문 엔티티
 * 설문에 대한 정보를 저장하는 테이블과 매핑
 * 설문 제목, 설명, 유형 및 생성일 등을 포함
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "survey")

public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long surveyId; // 설문 ID

    private String surveyTitle; // 설문 제목

    @Lob
    private String description; // 설문 설명

    @Enumerated(EnumType.STRING)
    private SurveyType type; // 설문 유형 (FREE, PAID, BOTH)

    private LocalDateTime createdAt; // 생성일

    public enum SurveyType {
        FREE, PAID, BOTH
    }
}
