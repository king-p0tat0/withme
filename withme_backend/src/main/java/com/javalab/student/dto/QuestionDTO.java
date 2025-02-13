package com.javalab.student.dto;

import com.javalab.student.entity.Question;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 📌 질문 DTO (무료 & 유료 문진 공통 사용)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long questionId;
    private Integer seq;
    private String questionText;
    private String questionType;
    private Long surveyId;
    private Long topicId;
    private List<ChoiceDTO> choices;

    /**
     * ✅ Question 엔티티 → QuestionDTO 변환 메서드
     */
    public static QuestionDTO fromEntity(Question question) {
        return QuestionDTO.builder()
                .questionId(question.getQuestionId())
                .seq(question.getSeq())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType().name())
                .surveyId(question.getSurvey().getSurveyId())
                .topicId(question.getSurveyTopic().getTopicId())
                .choices(question.getChoices().stream()
                        .map(ChoiceDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
