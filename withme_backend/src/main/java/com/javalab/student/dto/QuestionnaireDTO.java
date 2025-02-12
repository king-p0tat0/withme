package com.javalab.student.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 문진 DTO
 * 유저가 진행 중인 문진에 대한 정보를 클라이언트와 주고 받을 때 사용하는 객체
 * 설문 ID, 유저 ID, 반려동물 ID, 문진 상태, 시작일 등을 포함
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionnaireDTO {
    private Long questionnaireId;
    private Long surveyId;
    private Long id;  // ✅ userId → id 변경
    private String responseStatus;
    private LocalDateTime createdAt;
}
