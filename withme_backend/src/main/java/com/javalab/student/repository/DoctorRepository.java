package com.javalab.student.repository;

import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUser_UserId(String userId);
}
