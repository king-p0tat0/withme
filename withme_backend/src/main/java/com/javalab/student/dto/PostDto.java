package com.javalab.student.dto;


import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {
    
    private long postId;
    
    private Long userId;
    
    private String postTitle;
    
    private String postContent;
    
    private Integer pointsEarned;
    
    private Date createdAt;
    
    private Date updatedAt;
    
    private int viewCount; // 조회수
    
    private String category; // 카테고리
    
    private List<CommentDto> comments; // 댓글 리스트 (DTO로 매핑)
}
