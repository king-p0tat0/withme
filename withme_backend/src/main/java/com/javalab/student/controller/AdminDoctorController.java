package com.javalab.student.controller;

import com.javalab.student.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/doctors")
@RequiredArgsConstructor
public class AdminDoctorController {
    private final DoctorService doctorService;

    @PutMapping("/approve/{userId}")
    public ResponseEntity<String> approveDoctor(@PathVariable String userId) {
        doctorService.approveDoctorApplication(userId);
        return ResponseEntity.ok("Doctor application approved successfully");
    }
}