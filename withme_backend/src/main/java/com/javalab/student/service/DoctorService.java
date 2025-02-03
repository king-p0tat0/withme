package com.javalab.student.service;

import com.javalab.student.constant.Role;
import com.javalab.student.constant.Status;
import com.javalab.student.dto.DoctorFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.User;
import com.javalab.student.repository.DoctorRepository;
import com.javalab.student.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    /**
     * Doctor 신청정보 저장
     * - doctor 테이블에 신청정보 저장
     * - 로그인 사용자 정보를 통해 user 정보 저장
     */
    public Doctor saveDoctorApplication(DoctorFormDto doctorFormDto, String userId) {
        User user = userRepository.findByUserId(userId);

        // Doctor 객체 생성 및 저장
        Doctor doctor = Doctor.builder()
                .user(user)
                .subject(doctorFormDto.getSubject())
                .hospital(doctorFormDto.getHospital())
                .doctorNumber(doctorFormDto.getDoctorNumber())
                .status(Status.PENDING)
                .build();

        return doctorRepository.save(doctor);
    }

    /**
     * Doctor 신청정보 조회
     * - doctor 테이블에서 신청정보 조회
     */
    public Doctor getDoctorApplication(String userId) {

        return doctorRepository.findByUser_UserId(userId);
    }

    /**
     * Doctor 신청정보 수정
     * - doctor 테이블에 신청정보 수정
     */
    public Doctor updateDoctorApplication(String userId, DoctorFormDto doctorFormDto) {
        Doctor doctor = getDoctorApplication(userId);

        doctor.setSubject(doctorFormDto.getSubject());
        doctor.setHospital(doctorFormDto.getHospital());
        doctor.setDoctorNumber(doctorFormDto.getDoctorNumber());

        return doctorRepository.save(doctor);
    }

    /**
     * Doctor 신청정보 삭제
     * - doctor 테이블에서 신청정보 삭제
     */
    public void deleteDoctorApplication(String userId) {
        Doctor doctor = getDoctorApplication(userId);
        doctorRepository.delete(doctor);
    }

    /**
     * Doctor 신청 승인
     * - doctor 테이블에서 신청 승인
     * - user 테이블에서 권한 DOCTOR로 변경
     * - doctor 테이블에서 상태를 승인으로 변경
     */
    public void approveDoctorApplication(String userId) {
        Doctor doctor = getDoctorApplication(userId);
        User user = doctor.getUser();

        user.setRole(Role.DOCTOR);
        doctor.setStatus(Status.APPROVED);

        userRepository.save(user);
        doctorRepository.save(doctor);
    }
}
