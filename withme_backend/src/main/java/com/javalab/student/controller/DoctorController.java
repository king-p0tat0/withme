package com.javalab.student.controller;

import com.javalab.student.dto.DoctorFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;

    @PostMapping("/apply")
    public ResponseEntity<Doctor> applyDoctor(
            @Valid @RequestBody DoctorFormDto doctorFormDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        Doctor doctor = doctorService.saveDoctorApplication(doctorFormDto, userDetails.getUsername());
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/application")
    public ResponseEntity<Doctor> getApplication(@AuthenticationPrincipal UserDetails userDetails) {
        Doctor doctor = doctorService.getDoctorApplication(userDetails.getUsername());
        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/application")
    public ResponseEntity<Doctor> updateApplication(
            @Valid @RequestBody DoctorFormDto doctorFormDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        Doctor doctor = doctorService.updateDoctorApplication(userDetails.getUsername(), doctorFormDto);
        return ResponseEntity.ok(doctor);
    }

    @DeleteMapping("/application")
    public ResponseEntity<Void> deleteApplication(@AuthenticationPrincipal UserDetails userDetails) {
        doctorService.deleteDoctorApplication(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}


