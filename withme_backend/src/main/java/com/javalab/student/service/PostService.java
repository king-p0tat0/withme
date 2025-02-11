package com.javalab.student.service;

import java.util.List;

import com.javalab.student.dto.PostDto;

public interface PostService {
    PostDto createPost(PostDto postDto);
    List<PostDto> getAllPosts();
    PostDto getPostById(Long id);
    PostDto updatePost(Long id, PostDto postDto, String currentUserId);
    void deletePost(Long id, String currentUserId);
}
