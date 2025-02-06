package com.javalab.student.controller;

import com.javalab.student.entity.Doctor;
import com.javalab.student.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/doctor")
@RequiredArgsConstructor
@Log4j2
public class AdminDoctorController {
    private final DoctorService doctorService;



    /**
     * 전문가 리스트 전체 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<Doctor>> getDoctorList() {
        return ResponseEntity.ok(doctorService.getDoctorList());
    }

    /**
     * 승인 대기중 전문가 리스트 조회
     * - 전문가 상태가 대기,보류,거절인 전문가 리스트 조회
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Doctor>> getPendingDoctorList() {
        return ResponseEntity.ok(doctorService.getPendingDoctorList());
    }

    /**
     * 전문가 승인
     * - Put으로 받은 email를 사용해서 전문가 승인 및 user role을 doctor로 변경
     */
    @PutMapping("/approve/{email}")
    public ResponseEntity<String> approveDoctor(
            @PathVariable String email,
            @RequestBody Map<String, String> requestBody) {

        String status = requestBody.get("status");

        doctorService.approveDoctorApplication(email, status);
        return ResponseEntity.ok("Doctor application approved successfully");
    }
}