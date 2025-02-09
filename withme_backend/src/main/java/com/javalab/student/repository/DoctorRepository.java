package com.javalab.student.repository;

import com.javalab.student.constant.Status;
import com.javalab.student.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    /* 해당 상테만 제외하고 조회*/
    List<Doctor> findByStatusNot(Status status);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.member")
    List<Doctor> findAllWithMember();

    Doctor findByMemberEmail(String email);
}
