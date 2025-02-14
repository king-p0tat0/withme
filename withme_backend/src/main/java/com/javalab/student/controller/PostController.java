package com.javalab.student.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.javalab.student.dto.CommentDto;
import com.javalab.student.dto.PostDto;
import com.javalab.student.service.CommentService;
import com.javalab.student.service.PostService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import net.coobird.thumbnailator.Thumbnails;

import java.util.UUID;

import org.springframework.data.domain.Sort;


@RestController
@RequestMapping("/api/posts")
@PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
@Slf4j
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    // 모든 게시글 조회
    @GetMapping
    public ResponseEntity<?> getAllPosts(
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("regTime").descending());
        Page<PostDto> posts = postService.getAllPosts(pageRequest);
        return ResponseEntity.ok(Map.of("total", posts.getTotalElements(), "posts", posts.getContent()));
    }

    // 특정 게시글 조회 (조회수 증가 포함)
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable("postId") Long postId) {
        PostDto postDto = postService.increaseViewsAndGet(postId);
        return ResponseEntity.ok(postDto);
    }

    // 특정 게시글 댓글
    @GetMapping("/{postId}/comments")
public ResponseEntity<List<CommentDto>> getCommentsByPostId(
    @PathVariable("postId") Long postId
) {
    List<CommentDto> comments = commentService.getCommentsByPostId(postId);
    return ResponseEntity.ok(comments);
}
    // 게시글 생성
    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostDto postDto, BindingResult result, Principal principal) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        Long userId = postService.getUserIdByEmail(principal.getName()); // 이메일로 사용자 ID 조회
        postDto.setUserId(userId); // PostDto에 사용자 ID 설정

        return ResponseEntity.ok(postService.createPost(postDto));
    }

    // 게시글 수정
@PutMapping("/{postId}")
public ResponseEntity<PostDto> updatePost(
    @PathVariable("postId") Long postId,  // 명시적으로 이름 지정
    @RequestBody PostDto postDto,
    Principal principal
) {
    Long userId = postService.getUserIdByEmail(principal.getName());
    return ResponseEntity.ok(postService.updatePost(postId, postDto, userId));
}

    // 게시글 삭제
    @DeleteMapping("/{postId}")
public ResponseEntity<Void> deletePost(
    @PathVariable("postId") Long postId,
    Principal principal
) {
    Long userId = postService.getUserIdByEmail(principal.getName());
    postService.deletePost(postId, userId);
    return ResponseEntity.noContent().build();
}


    // 댓글 생성
    @PostMapping("/{postId}/comments")
public ResponseEntity<?> createComment(
    @PathVariable("postId") Long postId, 
    @Valid @RequestBody CommentDto commentDto, 
    Principal principal
) {
    try {
        log.info("댓글 생성 시도 - postId: {}, userId: {}, content: {}", 
            postId, principal.getName(), commentDto.getContent());

        Long userId = postService.getUserIdByEmail(principal.getName());
        commentDto.setPostId(postId);
        commentDto.setUserId(userId);
        
        CommentDto savedComment = commentService.createComment(commentDto);
        
        log.info("댓글 생성 성공 - commentId: {}", savedComment.getId());
        return ResponseEntity.ok(savedComment);
    } catch (Exception e) {
        log.error("댓글 생성 실패 - postId: {}, error: {}", postId, e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "댓글 생성 중 오류가 발생했습니다."));
    }
}

    // 댓글 수정
    @PutMapping("/{postId}/comments/{commentId}")
public ResponseEntity<?> updateComment(
    @PathVariable("postId") Long postId, 
    @PathVariable("commentId") Long commentId, 
    @RequestBody CommentDto commentDto, 
    Principal principal
) {
    try {
        Long userId = postService.getUserIdByEmail(principal.getName());
        commentDto.setId(commentId);
        commentDto.setPostId(postId);
        
        CommentDto updatedComment = commentService.updateComment(commentDto, userId);
        return ResponseEntity.ok(updatedComment);
    } catch (Exception e) {
        log.error("댓글 수정 중 오류 발생", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "댓글 수정 중 오류가 발생했습니다."));
    }
}
//댓글 삭제
@DeleteMapping("/{postId}/comments/{commentId}")
public ResponseEntity<?> deleteComment(
    @PathVariable("postId") Long postId, 
    @PathVariable("commentId") Long commentId, 
    Principal principal
) {
    try {
        Long userId = postService.getUserIdByEmail(principal.getName());
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        log.error("댓글 삭제 중 오류 발생", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "댓글 삭제 중 오류가 발생했습니다."));
    }
}

//스마트에디터 이미지 업로드
@PostMapping("/upload")
public ResponseEntity<Map<String, String>> uploadImage(
    @RequestParam("image") MultipartFile file,
    @Value("${upload.path}") String uploadPath
) {
    try {
        // 원본 이미지 저장
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        Path targetLocation = Paths.get(uploadPath).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // 썸네일 생성
        String thumbnailName = "thumb_" + fileName;
        Path thumbnailPath = Paths.get(uploadPath).resolve(thumbnailName);
        
        // Thumbnailator 라이브러리 사용
        Thumbnails.of(targetLocation.toFile())
            .size(300, 300) // 썸네일 크기 조정
            .toFile(thumbnailPath.toFile());
        
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", "/uploads/" + fileName);
        response.put("thumbnailUrl", "/uploads/" + thumbnailName);
        
        return ResponseEntity.ok(response);
    } catch (IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
}
