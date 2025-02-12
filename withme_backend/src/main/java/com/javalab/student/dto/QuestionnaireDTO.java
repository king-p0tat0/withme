package com.javalab.student.dto;

import com.javalab.student.entity.Questionnaire;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 📌 문진(Questionnaire) DTO
 * - 문진 결과를 API 응답으로 전달할 때 사용하는 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionnaireDTO {
    private Long questionnaireId;
    private Long surveyId;
    private Long userId;
    private String responseStatus;
    private Integer score;
    private String surveyType;
    private LocalDateTime createdAt;

    // ✅ Entity → DTO 변환 메서드
    public static QuestionnaireDTO fromEntity(Questionnaire questionnaire) {
        return QuestionnaireDTO.builder()
                .questionnaireId(questionnaire.getQuestionnaireId())
                .surveyId(questionnaire.getSurvey().getSurveyId())
                .userId(questionnaire.getUser().getId())
                .responseStatus(questionnaire.getResponseStatus().name())
                .score(questionnaire.getScore())
                .surveyType(questionnaire.getSurveyType())
                .createdAt(questionnaire.getCreatedAt())
                .build();
    }
}
