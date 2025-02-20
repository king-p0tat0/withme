package com.javalab.student.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity  // JPA가 관리하는 엔티티임을 명시
@Table(name = "substance")  // 실제 DB 테이블 이름 지정
//@Document(indexName = "substance_index")
@Getter
@Setter  // Lombok: 모든 필드의 getter/setter 자동 생성
@NoArgsConstructor  // Lombok: 기본 생성자 자동 생성
public class Substance {
    @Id
    @Column(name = "substance_id")
    @Field(type = FieldType.Long)
    private Long substanceId;

    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Keyword)
    private String name;

    @OneToMany(mappedBy = "substance")
    private Set<PetAllergy> petAllergies = new HashSet<>();



}