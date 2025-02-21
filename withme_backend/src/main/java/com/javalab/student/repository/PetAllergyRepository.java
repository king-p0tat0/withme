package com.javalab.student.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.javalab.student.entity.PetAllergy;
import java.util.List;

@Repository
public interface PetAllergyRepository extends JpaRepository<PetAllergy, Long> {
    @Query("SELECT pa FROM PetAllergy pa JOIN FETCH pa.substance WHERE pa.pet.petId = :petId")
    List<PetAllergy> findByPetIdFetchSubstance(@Param("petId") Long petId);

    @Query(value = "SELECT substance_id FROM pet_allergy WHERE pet_id = :petId", nativeQuery = true)
    List<Long> findSubstanceIdsByPetId(@Param("petId") Long petId);

    @Modifying
    @Query("DELETE FROM PetAllergy pa WHERE pa.pet.petId = :petId")
    void deleteByPetId(@Param("petId") Long petId);
}