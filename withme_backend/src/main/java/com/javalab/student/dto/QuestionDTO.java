package com.javalab.student.dto;

import lombok.*;

/**
 * 질문 DTO
 * 설문 질문 정보를 클라이언트와 주고받을 때 사용하는 객체
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long questionId;  // 질문 ID
    private Integer seq;  // 문항 순서
    private String questionText;  // 질문 내용
    private String questionType;  // ✅ 질문 유형 (ENUM → String으로 변환하여 저장)
    private Long topicId; // ✅ 주제 ID (SurveyTopic을 참조)
}
