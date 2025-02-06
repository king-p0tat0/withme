package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 📌 유저가 선택한 주제(UserSelectedTopics) 엔티티
 * - userId 기반으로 유저가 선택한 주제를 저장
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_selected_topics")
public class UserSelectedTopics {

    @Id
    private String userId;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private SurveyTopic surveyTopic;
}