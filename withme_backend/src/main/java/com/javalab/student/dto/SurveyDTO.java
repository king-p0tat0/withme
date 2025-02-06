package com.javalab.student.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 설문 DTO
 * 설문에 대한 데이터를 클라이언트와 주고 받을 때 사용하는 객체
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyDTO {
    private Long survey_id;  // 설문 ID
    private String survey_title;  // 설문 제목
    private String description;  // 설문 설명
    private String type;  // 설문 유형
    private LocalDateTime created_at;  // 설문 생성일
}