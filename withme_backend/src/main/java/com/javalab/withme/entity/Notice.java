package com.javalab.withme.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID

    private String title; // 제목

    private String content; // 내용

    private String category; // 카테고리

    private LocalDateTime createdAt; // 생성 시간

    private LocalDateTime updatedAt; // 수정 시간

// 카테고리
// 이벤트 및 프로모션
//시스템 점검 및 서비스 안내
// 법률 및 정책 안내
// 운영 공지
// 긴급 공지 (중요) 상단에 고정

}
