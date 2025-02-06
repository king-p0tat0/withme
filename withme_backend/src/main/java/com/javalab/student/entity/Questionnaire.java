package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

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
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey; // 설문 정보

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member user; // 유저 정보

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "pet_id", nullable = false)
//    private Pet pet; // 반려동물 정보

    @Enumerated(EnumType.STRING)
    @Column(name = "response_status", nullable = false)
    private ResponseStatus responseStatus; // 문진 상태

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 문진 시작일

    public enum ResponseStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }
}