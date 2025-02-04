package com.javalab.student.dto;

import com.javalab.student.entity.Survey;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 설문 DTO
 * 설문에 대한 데이터를 클라이언트와 주고 받을 때 사용하는 객체
 * 설문 제목, 설명, 유형 생성일등을 포함
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SurveyDTO {
    private Long surveyId; // 설문 ID
    private String surveyTitle; // 설문 제목
    private String description; // 설문 설명
    private Survey.SurveyType type; // 설문 유형(FREE, PAID, BOTH)
    private LocalDateTime createdAt; //  설문 생성일

    public enum SurveyType {
        FREE, PAID, BOTH
    }
}
