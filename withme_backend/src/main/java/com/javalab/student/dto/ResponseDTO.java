package com.javalab.student.dto;

import lombok.*;

/**
 * 응답 DTO
 * 설문 응답 정보를 클라이언트와 주고받을 때 사용하는 객체
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResponseDTO {
    private Long response_id;  // 응답 ID (DB 컬럼명과 일치)
    private Long survey_id;  // 설문 ID
    private Long question_id;  // 질문 ID
    private Long choice_id;  // 선택지 ID
    private Long user_id; // 유저 ID
}