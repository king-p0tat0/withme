package com.javalab.withme.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.javalab.withme.dto.PostDto;
import com.javalab.withme.entity.Post;
import com.javalab.withme.repository.PostRepository;

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
    public PostDto updatePost(Long id, PostDto postDto, String currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!post.getUserId().equals(currentUserId)) {
            throw new SecurityException("작성자만 게시글을 수정할 수 있습니다.");
        }

        // 게시글 수정
        post.setPostTitle(postDto.getPostTitle());
        post.setPostContent(postDto.getPostContent());
        post.setCategory(postDto.getCategory());
        return mapToDto(postRepository.save(post));
    }

    @Override
    public void deletePost(Long id, String currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 작성자 확인
        if (!post.getUserId().equals(currentUserId)) {
            throw new SecurityException("작성자만 게시글을 삭제할 수 있습니다.");
        }

        // 게시글 삭제
        postRepository.delete(post);
    }

    private PostDto mapToDto(Post post) {
        return PostDto.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .postTitle(post.getPostTitle())
                .postContent(post.getPostContent())
                .category(post.getCategory())
                .viewCount(post.getViewCount())
                .build();
    }
}
