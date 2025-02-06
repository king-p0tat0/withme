package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "survey_topic")
public class SurveyTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Long topicId; // 주제 ID

    @Column(name = "topic_name", nullable = false, length = 255)
    private String topicName; // 주제명

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false) // ✅ Survey와 연관 관계 설정
    private Survey survey;
}
