package com.javalab.student.dto;

import com.javalab.student.entity.Survey;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    private Long surveyId;  // 설문 ID

    @NotNull(message = "설문 제목은 필수입니다.")  // 유효성 검사 추가
    @Size(min = 3, max = 100, message = "설문 제목은 3자 이상, 100자 이하로 입력해주세요.")
    private String surveyTitle;  // 설문 제목

    @Size(max = 500, message = "설문 설명은 500자 이하로 입력해주세요.")
    private String description;  // 설문 설명

    @NotNull(message = "설문 유형은 필수입니다.")
    private SurveyType type;  // 설문 유형 (FREE, PAID, BOTH)

    private LocalDateTime createdAt;  // 설문 생성일

    public enum SurveyType {
        FREE, PAID, BOTH
    }
}
