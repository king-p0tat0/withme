package com.javalab.student.repository;

import com.javalab.student.constant.Status;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.DoctorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DoctorApplicationRepository extends JpaRepository<DoctorApplication, Long> {


    DoctorApplication findByMemberEmail(String email);



    /**
     * 특정 상태들(PENDING, ON_HOLD, REJECTED)로 필터링
     */
    List<DoctorApplication> findByStatusIn(List<Status> statuses);
}
