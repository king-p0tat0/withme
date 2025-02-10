package com.javalab.withme.repository;

import com.javalab.withme.constant.Role;
import com.javalab.withme.entity.Member;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // PasswordEncoder 주입

    /**
     * 테스트를 위한 Member 객체 생성 메서드
     */
    private Member createMember(String name, String email, String password, String address, String phone, Role role) {
        return Member.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password)) // 비밀번호 암호화
                .address(address)
                .phone(phone)
                .role(role)
                .createdAt(LocalDateTime.now()) // 현재 시간으로 createdAt 설정
                .points(0) // 초기 포인트 설정
                .social(false) // 소셜 로그인 여부 초기화
                .provider("local") // 기본 제공자 설정
                .build();
    }

    /**
     * 회원 저장 테스트
     */
    @Test
    @DisplayName("회원 저장 테스트")
    @Commit
    void saveMemberTest() {
        // Given: 새로운 회원 생성
        Member member = createMember("김길동", "test1@test.com", "1234", "경기도 경기", "010-9876-5432", Role.ADMIN);

        // When: 회원 저장
        Member savedMember = memberRepository.save(member);

        // Then: 저장된 회원 정보 검증
        assertThat(savedMember).isNotNull();
        assertThat(savedMember.getId()).isNotNull();
        assertThat(savedMember.getCreatedAt()).isNotNull(); // createdAt 값이 설정되었는지 확인
        //assertThat(savedMember.getEmail()).isEqualTo("test@test.com");
        assertThat(savedMember.getEmail()).isEqualTo("test1@test.com");
        assertThat(savedMember.getName()).isEqualTo("김길동");
        assertThat(savedMember.getPhone()).isEqualTo("010-9876-5432");
        assertThat(savedMember.getPoints()).isEqualTo(0);
        assertThat(savedMember.getProvider()).isEqualTo("local");
        assertThat(savedMember.isSocial()).isFalse();

        // 비밀번호가 암호화되었는지 확인 (원본과 다르며 매칭되는지 확인)
        assertThat(passwordEncoder.matches("1234", savedMember.getPassword())).isTrue();
    }
}
