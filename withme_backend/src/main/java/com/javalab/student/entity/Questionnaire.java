package com.javalab.student.entity;

import com.javalab.student.constant.Status;
import com.javalab.student.constant.Status_questionnaire;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity  // JPA가 관리하는 엔티티임을 명시
@Table(name = "questionnaire")  // 실제 DB 테이블 이름 지정
@Getter
@Setter  // Lombok: 모든 필드의 getter/setter 자동 생성
@NoArgsConstructor  // Lombok: 기본 생성자 자동 생성
public class Questionnaire {
    @Id
    @Column(name = "questionnaire_id")
    private Long questionnaireId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status_questionnaire status_questionnaire = Status_questionnaire.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;



}