package com.javalab.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javalab.student.entity.Notice;

// Notice 엔티티와 연결된 Repository 인터페이스
public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
