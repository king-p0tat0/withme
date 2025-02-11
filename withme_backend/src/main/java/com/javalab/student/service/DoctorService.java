package com.javalab.student.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.javalab.student.constant.Role;
import com.javalab.student.constant.Status;
import com.javalab.student.dto.DoctorFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.Member;
import com.javalab.student.repository.DoctorRepository;
import com.javalab.student.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final MemberRepository memberRepository;

    /**
     * Doctor 신청정보 저장
     * - doctor 테이블에 신청정보 저장
     * - 로그인 사용자 정보를 통해 user 정보 저장
     */
    public Doctor saveDoctorApplication(DoctorFormDto doctorFormDto, String email) {
        Member member = memberRepository.findByEmail(email);

        // Doctor 객체 생성 및 저장
        Doctor doctor = Doctor.builder()
                .member(member)
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
     * - 로그인 사용자의 본인 신청정보만 조회
     */
    public Doctor getDoctorApplication(String email) {
        return doctorRepository.findByMemberEmail(email);
    }

    /**
     * Doctor 신청정보 수정
     * - doctor 테이블에 신청정보 수정
     */
    public Doctor updateDoctorApplication(String email, DoctorFormDto doctorFormDto) {
        Doctor doctor = getDoctorApplication(email);

        doctor.setSubject(doctorFormDto.getSubject());
        doctor.setHospital(doctorFormDto.getHospital());
        doctor.setDoctorNumber(doctorFormDto.getDoctorNumber());

        return doctorRepository.save(doctor);
    }

    /**
     * Doctor 신청정보 삭제
     * - doctor 테이블에서 신청정보 삭제
     */
    public void deleteDoctorApplication(String email) {
        Doctor doctor = getDoctorApplication(email);
        doctorRepository.delete(doctor);
    }

    /**
     * Doctor 권한 변경 (승인, 거절, 보류 , 대기)
     * - doctor 테이블에서 신청 상태 변경
     * - 승인시 user 테이블에서 권한 DOCTOR로 변경
     */
    public void approveDoctorApplication(String email, String status) {
        Doctor doctor = getDoctorApplication(email);
        Member member = doctor.getMember();
        Status doctorStatus = Status.valueOf(status.toUpperCase());

        if(doctorStatus.equals(Status.APPROVED)) {
            doctor.setStatus(Status.APPROVED);
            member.setRole(Role.DOCTOR);
            memberRepository.save(member);
        }
        else if(doctorStatus.equals(Status.REJECTED)) {
            doctor.setStatus(Status.REJECTED);
        }
        else if(doctorStatus.equals(Status.ON_HOLD)) {
            doctor.setStatus(Status.ON_HOLD);
        }
        else if(doctorStatus.equals(Status.PENDING)) {
            doctor.setStatus(Status.PENDING);
        }

        doctorRepository.save(doctor);
    }



    /**
     * Doctor 전체 리스트 조회
     */

    public List<Doctor> getDoctorList() {
        return doctorRepository.findAllWithMember();
    }

    /**
     * Doctor 승인 대기중 리스트 조회
     * - 대기, 보류, 거절 상태 모두 포함해서 조회
     */
    public List<Doctor> getPendingDoctorList() {
        return doctorRepository.findByStatusNot(Status.APPROVED);
    }
}