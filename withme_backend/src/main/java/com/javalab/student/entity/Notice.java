package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID

    private String title; // 제목

    private String content; // 내용

    private String category; // 카테고리

    private LocalDateTime createdAt; // 생성 시간

    private LocalDateTime updatedAt; // 수정 시간
}
