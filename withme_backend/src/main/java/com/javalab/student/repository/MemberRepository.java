package com.javalab.student.repository;

import com.javalab.student.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // 이메일로 사용자를 조회 (Optional<Member> 반환)
    Optional<Member> findByEmail(String email);
}
