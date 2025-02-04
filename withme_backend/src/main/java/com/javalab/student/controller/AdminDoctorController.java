package com.javalab.student.controller;

import com.javalab.student.entity.Doctor;
import com.javalab.student.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminDoctorController {
    private final DoctorService doctorService;

    @PutMapping("/approve/{userId}")
    public ResponseEntity<String> approveDoctor(@PathVariable String userId) {
        doctorService.approveDoctorApplication(userId);
        return ResponseEntity.ok("Doctor application approved successfully");
    }

    /**
     * 전문가 리스트 전체 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<Doctor>> getDoctorList() {
        return ResponseEntity.ok(doctorService.getDoctorList());
    }
}