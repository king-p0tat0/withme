package com.javalab.student.repository;

import com.javalab.student.entity.Pet;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    // 특정 사용자의 반려동물 목록 조회 (페이징 지원)
    //Page<Pet> findByUserId(Long userId, Pageable pageable);
    //List<Pet> findAllByUserId(Long userId);

    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.allergies WHERE p.userId = :userId")
    List<Pet> findAllByUserIdWithAllergies(@Param("userId") Long userId);

    @Query("SELECT p FROM Pet p WHERE p.userId = :userId")
    Page<Pet> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.allergies WHERE p.petId = :petId")
    Optional<Pet> findByIdWithAllergies(@Param("petId") Long petId);
}