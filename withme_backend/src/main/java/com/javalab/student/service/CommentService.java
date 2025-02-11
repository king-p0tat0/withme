package com.javalab.student.service;

import org.springframework.stereotype.Service;

import com.javalab.student.entity.Comment;
import com.javalab.student.repository.CommentRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    // 생성자를 통해 의존성 주입
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public void deleteComment(Long postId, Long commentId, String currentUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getUserId().equals(currentUserId)) {
            throw new SecurityException("작성자만 댓글을 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }
}
