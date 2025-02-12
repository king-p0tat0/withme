package com.javalab.student.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.javalab.student.entity.Member;
import com.javalab.student.dto.CommentDto;
import com.javalab.student.entity.Comment;
import com.javalab.student.entity.Post;
import com.javalab.student.repository.CommentRepository;
import com.javalab.student.repository.MemberRepository;
import com.javalab.student.repository.PostRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final ModelMapper modelMapper;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,MemberRepository memberRepository, ModelMapper modelMapper) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
        this.modelMapper = modelMapper;
    }

// 게시글의 모든 댓글 조회 (옵션)
public List<CommentDto> getCommentsByPostId(Long postId) {
    List<Comment> comments = commentRepository.findByPost_IdAndParentCommentIsNull(postId);
    return comments.stream()
        .map(comment -> {
            CommentDto dto = modelMapper.map(comment, CommentDto.class);
            // 대댓글 처리
            dto.setReplies(getChildComments(comment));
            return dto;
        })
        .collect(Collectors.toList());
}

private List<CommentDto> getChildComments(Comment parentComment) {
    List<Comment> childComments = commentRepository.findByParentComment(parentComment);
    return childComments.stream()
        .map(comment -> modelMapper.map(comment, CommentDto.class))
        .collect(Collectors.toList());
}

    
    // 엔티티를 DTO로 변환하는 메서드
    private CommentDto convertToDto(Comment comment) {
        List<CommentDto> replies = comment.getReplies() != null ?
            comment.getReplies().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()) : null;

        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUserId())
                .userName(comment.getUserName())
                .content(comment.getContent())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(replies)
                .build();
    }

    @Transactional
public CommentDto createComment(CommentDto commentDto) {
    try {
        // 게시글 존재 확인
        Post post = postRepository.findById(commentDto.getPostId())
            .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        // 사용자 존재 확인
        Member member = memberRepository.findById(commentDto.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setPost(post);
        comment.setUserId(commentDto.getUserId());
        comment.setUserName(commentDto.getUserName());

        // 대댓글인 경우 부모 댓글 설정
        if (commentDto.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentDto.getParentCommentId())
                .orElseThrow(() -> new EntityNotFoundException("부모 댓글을 찾을 수 없습니다."));
            comment.setParentComment(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);
        return modelMapper.map(savedComment, CommentDto.class);

    } catch (Exception e) {
        log.error("댓글 생성 중 오류 발생: {}", e.getMessage(), e);
        throw new RuntimeException("댓글 생성에 실패했습니다.", e);
    }
}

// 추가 검증 메서드
private void validateCommentDto(CommentDto commentDto) {
    if (commentDto.getContent() == null || commentDto.getContent().trim().isEmpty()) {
        throw new IllegalArgumentException("댓글 내용은 필수입니다.");
    }
    if (commentDto.getContent().length() > 500) {
        throw new IllegalArgumentException("댓글은 500자 이내로 작성해야 합니다.");
    }
}

@Transactional
public CommentDto updateComment(CommentDto commentDto, Long userId) {
    try {
        // 댓글 존재 여부 확인
        Comment comment = commentRepository.findById(commentDto.getId())
            .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다."));

        // 수정 권한 확인
        if (!comment.getUserId().equals(userId)) {
            throw new AccessDeniedException("댓글 수정 권한이 없습니다.");
        }

        // 내용 업데이트
        comment.setContent(commentDto.getContent());
        
        // 부모 댓글 관계 유지
        if (comment.getParentComment() != null) {
            comment.setParentComment(comment.getParentComment());
        }

        Comment updatedComment = commentRepository.save(comment);

        // DTO 변환
        CommentDto resultDto = new CommentDto();
        resultDto.setId(updatedComment.getId());
        resultDto.setContent(updatedComment.getContent());
        resultDto.setPostId(updatedComment.getPost().getId());
        resultDto.setUserId(updatedComment.getUserId());
        resultDto.setUserName(updatedComment.getUserName());
        resultDto.setRegTime(updatedComment.getRegTime());
        
        // 부모 댓글 ID 설정
        if (updatedComment.getParentComment() != null) {
            resultDto.setParentCommentId(updatedComment.getParentComment().getId());
        }

        return resultDto;
    } catch (Exception e) {
        log.error("댓글 수정 중 오류 발생: {}", e.getMessage(), e);
        throw new RuntimeException("댓글 수정에 실패했습니다.", e);
    }
}

@Transactional
public void deleteComment(Long commentId, Long userId) {
    try {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다."));

        // 권한 확인
        if (!comment.getUserId().equals(userId)) {
            throw new AccessDeniedException("댓글 삭제 권한이 없습니다.");
        }

        // 대댓글이 있는 경우의 처리
        if (!comment.getReplies().isEmpty()) {
            // 옵션 1: 대댓글도 모두 삭제
            commentRepository.delete(comment);
            
            // 옵션 2: 내용만 "삭제된 댓글입니다"로 변경
            // comment.setContent("삭제된 댓글입니다.");
            // comment.setDeleted(true);
            // commentRepository.save(comment);
        } else {
            // 대댓글이 없는 경우 바로 삭제
            commentRepository.delete(comment);
        }
        
    } catch (EntityNotFoundException | AccessDeniedException e) {
        log.error("댓글 삭제 중 오류 발생: {}", e.getMessage());
        throw e;
    } catch (Exception e) {
        log.error("댓글 삭제 중 예기치 않은 오류 발생: {}", e.getMessage(), e);
        throw new RuntimeException("댓글 삭제에 실패했습니다.", e);
    }
}
    
}