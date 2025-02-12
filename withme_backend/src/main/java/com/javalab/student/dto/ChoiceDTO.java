package com.javalab.student.dto;

import lombok.*;

/**
 * 선택지 DTO
 * 질문에 대한 선택지 정보를 클라이언트와 주고 받을 때 사용하는 객체
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChoiceDTO {
    private Long choiceId;   // 선택지 ID
    private Long questionId; // ✅ 해당 선택지가 속한 질문 ID (필드명 확인 완료)
    private String choiceText; // 선택지 텍스트
    private Integer seq; // 선택지 순서
    private Integer score; // 선택지 점수
}
