package com.javalab.student.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 문진 DTO
 * 유저가 진행중인 문진에 대한 정보를 클라이언트와 주고 받을 때 사용하는 객체
 * 설문 ID, 유저 ID, 반려동물 ID, 문진 상태, 시작일 등을 포함
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionnaireDTO {
    private Long questionnaireId;  // 문진 ID
    private Long surveyId;  // 설문 ID
    private Long userId;  // 유저 ID
    private Long petId;  // 반려동물 ID
    private ResponseStatus responseStatus;  // 문진 상태 (PENDING, IN_PROGRESS, COMPLETED)
    private LocalDateTime createdAt;  // 문진 시작일

    public enum ResponseStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }
}
