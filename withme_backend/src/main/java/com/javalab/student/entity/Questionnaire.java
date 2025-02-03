package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;

/**
 * 문진 엔티티
 * 문진에 대한 정보를 저장하는 테이블과 매핑
 * 설문 ID, 유저 ID, 반려동물 ID, 문진 상태 및 시작일 등을 포함
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
    private Long questionnaireId; //  문진 ID

    @ManyToOne
    @JoinColumn(name = "survey_id")
    private Survey survey; // 해당 문진이 속한 설문

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // 해당 문진을 진행하는 유저

    private Long petId; //반려동물 ID

    @Enumerated(EnumType.STRING)
    private ResponseStatus responseStatus; // 문진 상태(PENDING, IN_PROGRESS, COMPLETED)

    private LocalDateTime createdAt; // 문진 시작일

    public enum ResponseStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }
}
