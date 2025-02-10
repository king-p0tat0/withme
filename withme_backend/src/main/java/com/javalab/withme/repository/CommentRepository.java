package com.javalab.withme.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javalab.withme.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
