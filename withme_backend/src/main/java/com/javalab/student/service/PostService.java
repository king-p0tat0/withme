package com.javalab.student.service;


import com.javalab.student.dto.PostDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    //PostDto createPost(PostDto postDto, String userId);
    Page<PostDto> getAllPosts(Pageable pageable);
    PostDto getPostById(Long id);

    PostDto createPost(PostDto postDto);

    PostDto updatePost(Long id, PostDto postDto, Long userId);
    void deletePost(Long id ,Long userId);

    // 이메일로 사용자 ID 조회 메서드 추가
    Long getUserIdByEmail(String email);

    PostDto increaseViewsAndGet(Long id);

    //사용자별 게시글 조회
    Page<PostDto> getPostsByUserId(Long userId, Pageable pageable);
}
