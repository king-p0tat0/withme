package com.javalab.student.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.javalab.student.constant.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity  // JPA가 관리하는 엔티티임을 명시
@Table(name = "pet")  // 실제 DB 테이블 이름 지정
@Getter
@Setter  // Lombok: 모든 필드의 getter/setter 자동 생성
@NoArgsConstructor  // Lombok: 기본 생성자 자동 생성
public class Pet {
    @Id
    @Column(name = "pet_id")
    private Long petId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "neutered")
    private Boolean neutered;

    @Column(name = "health_conditions")
    private String healthConditions;

    @Column(name = "breed", length = 50)
    private String breed;



}