package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.User;

/**
 * 유저가 선택한 주제 엔티티
 * 유저가 선택한 주제를 저장하는 테이블과 매핑
 * 유저 ID와 주제 ID를 포함
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
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // 유저ID

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private SurveyTopic surveyTopic; // 선택한 주제 ID
}
