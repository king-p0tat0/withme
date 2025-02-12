package com.javalab.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javalab.student.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
