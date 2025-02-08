package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 📌 문진(Questionnaire) 엔티티
 * - 특정 유저가 수행한 설문 정보 저장
 * - 반려견, 설문, 응답 상태 포함
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "questionnaire")
public class Questionnaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "questionnaire_id")
    private Long questionnaireId; // 문진 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member user; // ✅ 유저 정보 (Member 엔티티와 연결)

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "pet_id", nullable = false)
//    private Pet pet; // ✅ 반려견 정보 (Pet 엔티티와 연결)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey; // ✅ 설문 정보 (Survey 엔티티와 연결)

    @Enumerated(EnumType.STRING)
    @Column(name = "response_status", nullable = false)
    private ResponseStatus responseStatus = ResponseStatus.PENDING; // ✅ 기본값 PENDING 설정

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 문진 시작일

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // ✅ 기본값 설정
    }

    public enum ResponseStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }
}
