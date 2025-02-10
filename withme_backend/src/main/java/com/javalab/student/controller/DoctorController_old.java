/*
package com.javalab.student.controller;

import com.javalab.student.dto.DoctorFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.DoctorApplication;
import com.javalab.student.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

*/
/**
 * 의사 신청(Doctor Application) 관련 API를 관리하는 컨트롤러
 * 사용자는 자신의 의사 신청을 등록, 조회, 수정 및 삭제할 수 있음
 *//*

@RestController
@RequestMapping("/api/doctors")  // 기본 URL 설정
@RequiredArgsConstructor         // 생성자 주입을 자동으로 처리 (Lombok 기능)
@Log4j2
public class DoctorController_old {
    private final DoctorService doctorService;  // 의사 신청을 처리하는 서비스 객체

    */
/**
     * 새로운 의사 신청을 저장하는 API
     *
     * @param doctorFormDto 사용자 입력 데이터를 담은 DTO (의사 신청 정보)
     * @param userDetails 현재 로그인한 사용자 정보 (Spring Security에서 제공)
     * @return 저장된 의사 신청 정보 (DoctorApplication 엔티티)
     *//*

    @PostMapping("/apply")
    public ResponseEntity<DoctorApplication> applyDoctor(
            @Valid @RequestBody DoctorFormDto doctorFormDto,  // 요청 바디에서 DTO 데이터를 받아 유효성 검사
            @AuthenticationPrincipal UserDetails userDetails) {  // 현재 로그인한 사용자의 정보를 가져옴

        log.info("사용자 신청 요청 수신: {}", doctorFormDto);
        log.info("사용자 정보: {}", userDetails);
        // 사용자 정보를 기반으로 의사 신청을 저장
        DoctorApplication doctor = doctorService.saveDoctorApplication(doctorFormDto, userDetails.getUsername());

        return ResponseEntity.ok(doctor);  // 생성된 의사 신청 정보를 응답으로 반환
    }

    */
/**
     * 현재 로그인한 사용자의 의사 신청 정보를 조회하는 API
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 사용자의 의사 신청 정보 (Doctor 엔티티)
     *//*

    @GetMapping("/application")
    public ResponseEntity<Doctor> getApplication(@AuthenticationPrincipal UserDetails userDetails) {

        // 사용자의 아이디를 기반으로 신청 정보를 조회
        Doctor doctor = doctorService.getDoctorApplication(userDetails.getUsername());

        return ResponseEntity.ok(doctor);  // 조회된 신청 정보를 응답으로 반환
    }

    */
/**
     * 기존 의사 신청 정보를 수정하는 API
     *
     * @param doctorFormDto 수정할 의사 신청 정보 DTO
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 수정된 의사 신청 정보 (Doctor 엔티티)
     *//*

    @PutMapping("/application")
    public ResponseEntity<Doctor> updateApplication(
            @Valid @RequestBody DoctorFormDto doctorFormDto,  // 요청 바디에서 DTO 데이터를 받아 유효성 검사
            @AuthenticationPrincipal UserDetails userDetails) {  // 현재 로그인한 사용자 정보를 가져옴

        // 사용자의 기존 신청 정보를 업데이트
        Doctor doctor = doctorService.updateDoctorApplication(userDetails.getUsername(), doctorFormDto);

        return ResponseEntity.ok(doctor);  // 업데이트된 신청 정보를 응답으로 반환
    }

    */
/**
     * 기존 의사 신청 정보를 삭제하는 API
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 삭제 성공 시 HTTP 상태 코드 204 (No Content) 반환
     *//*

    @DeleteMapping("/application")
    public ResponseEntity<Void> deleteApplication(@AuthenticationPrincipal UserDetails userDetails) {

        // 사용자의 신청 정보를 삭제
        doctorService.deleteDoctorApplication(userDetails.getUsername());

        return ResponseEntity.noContent().build();  // 삭제 후 응답 본문 없이 상태 코드만 반환
    }
}
*/
