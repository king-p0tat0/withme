package com.javalab.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javalab.student.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
