package com.javalab.withme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDto {
    
    private Long id;
    private String title;
    private String content;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}