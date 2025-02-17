package com.javalab.student.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.javalab.student.constant.Role;
import com.javalab.student.dto.MemberFormDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * 회원 엔티티
 * - 회원 정보를 저장하는 엔티티 클래스
 * - 회원 정보를 저장하는 테이블과 매핑된다.
 * - 주로 서비스 레이어와 리포지토리 레이어에서 사용된다.
 * - 화면에서 데이터를 전달받는 용도로는 사용하지 않는게 관례이다.
 */
@Entity
@Table(name = "member")
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member extends BaseEntity{
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;

    // 이메일은 중복될 수 없다. unique = true
    @Column(unique = true)
    private String email;

    private String password;
    private String phone;
    private String address;

    @Builder
    public Member(String email, String password, String auth) {
        this.email = email;
        this.password = password;
    }

    // 회원의 권한을 나타내는 열거형 상수, 한 사용자가 다수의 권한을 가질 수 있다.
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = true, columnDefinition = "INT DEFAULT 0")
    private Integer points; // 사용자 포인트 (기본값: 0)

    @Column(nullable = false) // 기본값 설정을 위해 nullable=false
    private boolean social; // 소셜 로그인 여부, 이값을 사용하는 쪽에서는 e.g member.isSocial()로 사용

    private String provider; // 소셜 로그인 제공자 이름 (예: kakao)



    /*
        * 회원 엔티티 생성 정적 메서드
     */
    public static Member createMember(MemberFormDto memberFormDto, PasswordEncoder passwordEncoder) {
        Member member = new Member();
        member.setName(memberFormDto.getName());
        member.setEmail(memberFormDto.getEmail());
        String password = passwordEncoder.encode(memberFormDto.getPassword()); // 비밀번호 암호화
        member.setPassword(password);
        member.setAddress(memberFormDto.getAddress());
        member.setPhone(memberFormDto.getPhone());
        member.setPoints(0);
        member.setSocial(false); // 일반 회원가입이므로 소셜 로그인 여부는 false
        member.setRole(memberFormDto.getRole()); // 소셜 사용자는 기본적으로 USER 권한
        return member;
    }

    /**
     * 회원 엔티티 생성 정적 메서드 - 소셜 로그인용
     */
    public static Member createSocialMember(String email, String provider) {
        Member member = new Member();
        member.setEmail(email);
        member.setSocial(true); // 소셜 로그인 회원가입이므로 소셜 로그인 여부는 true
        member.setProvider(provider);
        member.setRole(Role.USER); // 소셜 사용자는 기본적으로 USER 권한
        member.setPoints(0);
        return member;
    }



    // 권한 정보 반환 메서드
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }
}
