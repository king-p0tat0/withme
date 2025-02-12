package com.javalab.student.dto;

import com.javalab.student.entity.Questionnaire;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 📌 문진 DTO
 * - 유저가 진행한 문진 정보를 담는 객체
 * - 백엔드와 프론트엔드 간의 데이터 전송을 위해 사용
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionnaireDTO {
    private Long questionnaireId;
    private Long surveyId;
    private Long userId;  // ✅ DTO에서는 userId 필드 사용 (Member 엔티티 대신)
    private String surveyType;
    private String responseStatus;
    private Integer score; // ✅ 총점 추가
    private LocalDateTime createdAt;

    /**
     * ✅ Questionnaire 엔티티를 DTO로 변환하는 정적 메서드
     */
    public static QuestionnaireDTO fromEntity(Questionnaire questionnaire) {
        return QuestionnaireDTO.builder()
                .questionnaireId(questionnaire.getQuestionnaireId())
                .surveyId(questionnaire.getSurvey().getSurveyId())
                .userId(questionnaire.getUser().getId()) // ✅ Member 엔티티에서 userId 가져오기
                .surveyType(questionnaire.getSurveyType())
                .responseStatus(questionnaire.getResponseStatus().name()) // ✅ ENUM -> String 변환
                .score(questionnaire.getScore())
                .createdAt(questionnaire.getCreatedAt())
                .build();
    }
}
