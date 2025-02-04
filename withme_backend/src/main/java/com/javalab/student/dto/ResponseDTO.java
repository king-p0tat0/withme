package com.javalab.student.dto;

import lombok.*;

/**
 * 응답 DTO
 * 설문 응답 정보를 클라이언트와 주고 받을 때 사용하는 객체
 * 유저가 선택한 질문에 대한 응답을 나타냄
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDTO {
    private Long responseId; // 응답 ID
    private Long surveyId; // 설문 ID
    private Long questionId; // 질문 ID
    private Long choiceId; // 선택지 ID
}
