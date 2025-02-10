package com.javalab.withme.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javalab.withme.entity.Member;

/**
 * Member 엔티티의 데이터베이스 작업을 처리하는 리포지토리
 */
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 이메일로 회원 조회 (로그인 시 사용)
    //Optional<Member> findByEmail(String email);

    // 전화번호로 회원 조회 (중복 체크 시 사용)
    //Optional<Member> findByPhone(String phone);

    Member findByEmail(String email);
    Member findByPhone(String phone);

    boolean existsByEmail(String email);

   
}
