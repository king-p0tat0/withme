package com.javalab.student.dto;

import com.javalab.student.entity.Question;
import lombok.*;

/**
 *  질문 DTO
 *  설문에 포함된 각 질문의 정보(질문내용, 유형, 필수 응답 여부 등)를 클라이언트와 주고 받을 때 사용하는 객체
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long questionId;  // 질문 ID
    private Long topicId;  // 해당 질문의 주제 ID
    private Integer seq;  // 문항 순서
    private String questionText;  // 질문 내용
    private QuestionType questionType;  // 질문 유형 (SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, RATING)
    private Boolean isRequired;  // 필수 응답 여부

    public enum QuestionType {
        SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, RATING
    }
}
