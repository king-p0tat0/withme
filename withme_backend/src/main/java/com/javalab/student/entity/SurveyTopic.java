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
    private Long topicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)  // survey_id와 연결
    private Survey survey;  // 연관된 설문

    @Column(name = "topic_name", nullable = false, length = 255)
    private String topicName;  // 주제명
}
