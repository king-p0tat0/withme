package com.javalab.student.repository;

import com.javalab.student.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 응답 Repository
 * Response 엔티티에 대한 CRUD 작업을 처리하는 리포지토리
 */
@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {

    /**
     * 특정 userId 기반으로 응답 목록 조회
     */
    List<Response> findByUser_UserId(String userId);
}