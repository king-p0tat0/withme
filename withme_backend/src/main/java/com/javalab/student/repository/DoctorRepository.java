package com.javalab.student.repository;

import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Doctor findByUser_UserId(String user);
    //Optional<Doctor> findByUser_UserId(String userId);
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user")
    List<Doctor> findAllWithUser();
}
