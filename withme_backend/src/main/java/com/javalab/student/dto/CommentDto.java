package com.javalab.student.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {
    
    private long commentId;
    
    private long postId; // 게시글 ID
    
    private Long userId;
    
    private String content;
    
    private Date createdAt;
    
    private Date updatedAt;
    
    private Long parentCommentId; // 부모 댓글 ID (null일 경우 최상위 댓글)
    
    private List<CommentDto> childComments; // 자식 댓글 리스트 (재귀 구조)
}
