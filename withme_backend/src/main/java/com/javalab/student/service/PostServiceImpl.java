package com.javalab.student.service;


import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.javalab.student.dto.CommentDto;
import com.javalab.student.dto.PostDto;
import com.javalab.student.entity.Comment;
import com.javalab.student.entity.Member;
import com.javalab.student.entity.Post;
import com.javalab.student.repository.MemberRepository;
import com.javalab.student.repository.PostRepository;

import org.springframework.data.domain.Pageable;

@Service
public class PostServiceImpl implements PostService {
    // 의존성 주입을 위한 필드
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final ModelMapper modelMapper;

    // 생성자 주입
    public PostServiceImpl(PostRepository postRepository, MemberRepository memberRepository, ModelMapper modelMapper) {
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
        this.modelMapper = modelMapper;
        configureModelMapper();
    }

    // ModelMapper 설정
    private void configureModelMapper() {
        modelMapper.typeMap(Comment.class, CommentDto.class).addMappings(mapper -> {
            mapper.map(src -> src.getPost().getId(), CommentDto::setPostId);
            mapper.map(src -> src.getParentComment() != null ? src.getParentComment().getId() : null,
                    CommentDto::setParentCommentId);
        });
    }

    // 게시글 목록 조회 (페이징, 정렬 적용)
    @Override
    public Page<PostDto> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable).map(this::entityToDto);
    }

    // 게시글 상세 조회
    @Override
    @Transactional(readOnly = true)
    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. ID: " + id));
        return modelMapper.map(post, PostDto.class);
    }

    // 게시글 조회수 증가 및 조회
    @Override
    @Transactional
    public PostDto increaseViewsAndGet(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. ID: " + id));
        
        post.setViews(post.getViews() + 1);
        Post savedPost = postRepository.save(post);
        
        return modelMapper.map(savedPost, PostDto.class);
    }

    // 게시글 생성
    @Override
    @Transactional
    public PostDto createPost(PostDto postDto) {
        Post post = modelMapper.map(postDto, Post.class);
        post.setUserId(postDto.getUserId());
        post.setViews(0);  // 초기 조회수 설정
        Post savedPost = postRepository.save(post);
        return modelMapper.map(savedPost, PostDto.class);
    }

    // 게시글 수정
    @Override
    @Transactional
    public PostDto updatePost(Long id, PostDto postDto, Long userId) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. ID: " + id));

        if (!existingPost.getUserId().equals(userId)) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        existingPost.setTitle(postDto.getTitle());
        existingPost.setContent(postDto.getContent());
        existingPost.setPostCategory(postDto.getPostCategory());
        Post savedPost = postRepository.save(existingPost);
        
        return modelMapper.map(savedPost, PostDto.class);
    }

    // 게시글 삭제
    @Override
    @Transactional
    public void deletePost(Long id, Long userId) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. ID: " + id));

        if (!existingPost.getUserId().equals(userId)) {
            throw new SecurityException("작성자만 삭제할 수 있습니다.");
        }

        postRepository.delete(existingPost);
    }

    // 이메일로 사용자 ID 조회
    @Override
    @Transactional(readOnly = true)
    public Long getUserIdByEmail(String email) {
        Member member = memberRepository.findByEmail(email);
        if (member == null) {
            throw new IllegalArgumentException("해당 이메일의 사용자를 찾을 수 없습니다: " + email);
        }
        return member.getId();
    }

    @Override
@Transactional(readOnly = true)
public Page<PostDto> getPostsByUserId(Long userId, Pageable pageable) {
    Page<Post> posts = postRepository.findByUserId(userId, pageable);
    return posts.map(this::entityToDto);
}

    // Entity를 DTO로 변환하는 유틸리티 메서드
    private PostDto entityToDto(Post post) {
        return PostDto.builder()
            .id(post.getId())
            .userId(post.getUserId())
            .title(post.getTitle())
            .content(post.getContent())
            .postCategory(post.getPostCategory())
            .views(post.getViews())
            .regTime(post.getRegTime())
            .updateTime(post.getUpdateTime())
            .build();
    }
}