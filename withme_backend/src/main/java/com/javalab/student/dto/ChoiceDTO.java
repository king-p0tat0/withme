package com.javalab.student.dto;

import com.javalab.student.entity.Choice;
import lombok.*;

/**
 * 📌 선택지 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChoiceDTO {
    private Long choiceId;
    private String choiceText;
    private Integer seq;
    private Integer score;

    /**
     * ✅ Choice 엔티티 → ChoiceDTO 변환 메서드
     */
    public static ChoiceDTO fromEntity(Choice choice) {
        return ChoiceDTO.builder()
                .choiceId(choice.getChoiceId())
                .choiceText(choice.getChoiceText())
                .seq(choice.getSeq())
                .score(choice.getScore())
                .build();
    }
}
