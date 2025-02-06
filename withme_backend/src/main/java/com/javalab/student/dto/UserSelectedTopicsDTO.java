package com.javalab.student.dto;

import lombok.*;

/**
 * 유저가 선택한 주제(UserSelectedTopics) DTO
 * 유저가 선택한 주제에 대한 정보를 클라이언트와 주고받을 때 사용하는 객체
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSelectedTopicsDTO {
    private String userId;  // 유저 세션 ID
    private Long topicId;  // 선택한 주제 ID
}
