package com.javalab.student.service;

import com.javalab.student.dto.PostDto;
import com.javalab.student.entity.Post;
import com.javalab.student.repository.PostRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;

    public PostServiceImpl(PostRepository postRepository, ModelMapper modelMapper) {
        this.postRepository = postRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public PostDto createPost(PostDto postDto) {
        Post post = modelMapper.map(postDto, Post.class);
        post.setCreatedAt(new Date());
        post.setViewCount(0);
        Post savedPost = postRepository.save(post);
        return modelMapper.map(savedPost, PostDto.class);
    }

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> modelMapper.map(post, PostDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public PostDto getPostById(Long id) {
        return modelMapper.map(
                postRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다.")),
                PostDto.class);
    }

    @Override
    public PostDto updatePost(Long id, PostDto postDto) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        existingPost.setPostTitle(postDto.getPostTitle());
        existingPost.setPostContent(postDto.getPostContent());
        existingPost.setUpdatedAt(new Date());
        existingPost.setCategory(postDto.getCategory());
        return modelMapper.map(postRepository.save(existingPost), PostDto.class);
    }

    @Override
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }
        postRepository.deleteById(id);
    }
}
