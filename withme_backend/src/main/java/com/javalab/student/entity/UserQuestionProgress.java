package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.User;

/**
 * 유저 문진 진행 엔티티
 * 유저가 진행중인 문진의 각 질문에 대한 진행 상태를 저장하는 테이블과 매핑
 * 유저의 진행 상태, 진행 비율, 문진 ID 및 질문 ID 를 포함
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_question_progress")

public class UserQuestionProgress {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; //유저 ID

    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire; // 문진 ID

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question; // 질문 ID

    @Enumerated(EnumType.STRING)
    private ProgressStatus status; // 진행상태 (NOT_STARTED, IN_PROGRESS, COMPLETED)

    private Integer progress; // 진행상태 비율(1~100)

    public enum ProgressStatus {
        NOT_STARTED, IN_PROGRESS, COMPLETED
    }

}
