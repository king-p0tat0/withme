package com.javalab.student.entity;

import com.javalab.student.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.javalab.student.constant.Role;
import com.javalab.student.dto.MemberFormDto;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

/**
 * 회원 엔티티
 * - 회원 정보를 저장하는 엔티티 클래스
 * - 데이터베이스의 member 테이블과 매핑된다.
 */
@Entity
@Table(name = "member")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id; // 아이디

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    @Column(name = "name", nullable = false, length = 50)
    private String name; // 사용자 이름

    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Column(nullable = false, unique = true, length = 100)
    private String email; // 사용자 이메일 (고유값)

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Column(nullable = false, length = 100)
    private String password; // 암호화된 비밀번호

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    @Column(nullable = false, length = 20, unique = true)
    private String phone; // 사용자 전화번호 (고유값)

    @NotBlank(message = "주소는 필수 입력 값입니다.")
    @Column(nullable = false, length = 255)
    private String address; // 사용자 주소

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // 사용자 역할

    @Column(nullable = true, columnDefinition = "INT DEFAULT 0")
    private Integer points; // 사용자 포인트 (기본값: 0)

    @Column(name = "created_at", nullable = true, updatable = false)
    private LocalDateTime createdAt; // 가입일 (자동으로 설정)

    @Column(nullable = true)
    private boolean social; // 소셜 로그인 여부

    @Column(nullable = true, length = 255)
    private String provider; // 소셜 제공자 이름 (예: kakao)

    /**
     * 회원 엔티티 생성 정적 메서드 - 일반 회원가입용
     */
    public static Member createMember(MemberFormDto memberFormDto, PasswordEncoder passwordEncoder) {
        return Member.builder()
                .email(memberFormDto.getEmail())
                .name(memberFormDto.getName())
                .address(memberFormDto.getAddress())
                .password(passwordEncoder.encode(memberFormDto.getPassword())) // 비밀번호 암호화 포함
                .phone(memberFormDto.getPhone())
                .role(memberFormDto.getRole())
                .points(0) // 기본 포인트 설정
                .createdAt(LocalDateTime.now()) // 가입일 설정
                .build();
    }

    /**
     * 회원 엔티티 생성 정적 메서드 - 소셜 로그인용
     */
    public static Member createSocialMember(String email, String provider) {
        return Member.builder()
                .email(email)
                .social(true) // 소셜 로그인 여부 설정
                .provider(provider)
                .role(Role.USER) // 소셜 사용자는 기본적으로 USER 권한 부여
                .points(0) // 기본 포인트 설정
                .createdAt(LocalDateTime.now()) // 가입일 설정
                .build();
    }

    /**
     * 권한 정보 반환 메서드 (Spring Security 사용 시 필요)
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }
}
