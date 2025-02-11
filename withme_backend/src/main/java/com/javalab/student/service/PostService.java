package com.javalab.student.service;

import com.javalab.student.dto.PostDto;

import java.util.List;

public interface PostService {
    PostDto createPost(PostDto postDto);
    List<PostDto> getAllPosts();
    PostDto getPostById(Long id);
    PostDto updatePost(Long id, PostDto postDto, String currentUserId);
    void deletePost(Long id, String currentUserId);
}
