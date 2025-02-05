package com.javalab.student.repository;

import com.javalab.student.constant.Status;
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

   /* @Query("SELECT d FROM Doctor d JOIN FETCH d.user WHERE d.status = :status")
    List<Doctor> findByStatusWithUser(Status status);*/

    /* 해당 상테만 제외하고 조회*/
    List<Doctor> findByStatusNot(Status status);

}
