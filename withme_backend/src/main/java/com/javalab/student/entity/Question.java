package com.javalab.student.entity;

import com.javalab.student.constant.Category_question;
import com.javalab.student.constant.Question_type;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity  // JPA가 관리하는 엔티티임을 명시
@Table(name = "question")  // 실제 DB 테이블 이름 지정
@Getter
@Setter  // Lombok: 모든 필드의 getter/setter 자동 생성
@NoArgsConstructor  // Lombok: 기본 생성자 자동 생성
public class Question {
    @Id
    @Column(name = "question_id")
    private Long questionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", columnDefinition = "ENUM('피부', '소화기')")
    private Category_question category;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", columnDefinition = "ENUM('MULTIPLE_CHOICE', 'OPEN')")
    private Question_type questionType;



}