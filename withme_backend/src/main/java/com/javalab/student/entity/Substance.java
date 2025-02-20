package com.javalab.student.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.data.elasticsearch.annotations.Document;

@Entity
@Table(name = "substance")
@Document(indexName = "substance_index")  // Elasticsearch 인덱스 설정
@Getter
@Setter
@NoArgsConstructor
public class Substance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "substance_id")
    private Long substanceId;

    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Keyword)  // Elasticsearch에서 검색 가능하도록 필드 매핑
    private String name;

    @OneToMany(mappedBy = "substance")
    private Set<PetAllergy> petAllergies = new HashSet<>();
}
