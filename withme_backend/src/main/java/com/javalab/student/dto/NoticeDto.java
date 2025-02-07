package com.javalab.student.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeDto {
    private Long id; // ID
    private String title; // 제목
    private String content; // 내용
    private String category; // 카테고리
    private LocalDateTime createdAt; // 생성 시간
    private LocalDateTime updatedAt; // 수정 시간
}
