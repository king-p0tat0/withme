package com.javalab.withme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity  // JPA가 관리하는 엔티티임을 명시
@Table(name = "pet_allergy")  // 실제 DB 테이블 이름 지정
@Getter
@Setter  // Lombok: 모든 필드의 getter/setter 자동 생성
@NoArgsConstructor  // Lombok: 기본 생성자 자동 생성
public class PetAllergy {
    @Id
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Id
    @ManyToOne
    @JoinColumn(name = "substance_id", nullable = false)
    private Substance substance;




}