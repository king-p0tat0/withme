package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 설문 주제 엔티티
 * 설문 주제에 대한 정보를 저장하는 테이블과 매핑
 * 설문에 포함된 각 주제의 ID와 이름을 포함
 */

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
    private Long topicId; // 주제 ID

    private String topicName; // 주제이름


}
