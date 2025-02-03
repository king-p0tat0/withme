package com.javalab.student.entity;

import com.javalab.student.constant.Role;
import com.javalab.student.dto.MemberFormDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Entity  // JPA가 관리하는 엔티티임을 명시
@Table(name = "user")  // 실제 DB 테이블 이름 지정
@Getter
@Setter  // Lombok: 모든 필드의 getter/setter 자동 생성
@NoArgsConstructor  // Lombok: 기본 생성자 자동 생성
public class User {
    @Id  // 기본키(Primary Key) 지정
    @Column(name = "user_id", length = 20, nullable = false)
    private String userId;  // VARCHAR(20) NOT NULL

    @Column(name = "user_name", length = 50, nullable = false)
    private String userName;  // VARCHAR(50) NOT NULL

    @Column(name = "password", length = 100, nullable = false)
    private String password;  // VARCHAR(100) NOT NULL

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;  // unique = true로 고유값 지정

    @Column(name = "address", length = 255, nullable = false)
    private String address;  // VARCHAR(255) NOT NULL

    @Column(name = "phone", length = 20, nullable = false, unique = true)
    private String phone;  // unique = true로 고유값 지정

    @Enumerated(EnumType.STRING)  // enum 값을 문자열로 저장
    @Column(name = "role")
    private Role role = Role.USER;  // 기본값 USER 설정

    @Column(name = "points")
    private Integer points = 0;  // 기본값 0 설정

    @Column(name = "created_at")
    @CreationTimestamp  // 엔티티가 생성될 때 자동으로 시간 설정
    private LocalDateTime createdAt;



}