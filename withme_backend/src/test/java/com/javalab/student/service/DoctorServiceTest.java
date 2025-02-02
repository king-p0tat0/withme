package com.javalab.student.service;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.javalab.student.constant.Role;
import com.javalab.student.constant.Status;
import com.javalab.student.dto.DoctorFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.User;
import com.javalab.student.repository.DoctorRepository;
import com.javalab.student.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.annotation.Commit;

@ExtendWith(MockitoExtension.class) // Mockito 확장 (단위 테스트)
@Commit // DB에 실제 반영됨
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository; // 가짜 doctorRepository

    @Mock
    private UserRepository userRepository; // 가짜 userRepository

    @InjectMocks
    private DoctorService doctorService; // 테스트 대상

    private User testUser;
    private Doctor testDoctor;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId("testUser");
        testUser.setUserName("John Doe");

        testDoctor = Doctor.builder()
                .user(testUser)
                .subject("Cardiology")
                .hospital("Good Hospital")
                .doctorNumber("D12345")
                .status(Status.PENDING)
                .build();
    }

    @Test
    @Commit // DB에 저장된 결과 확인 가능
    void testSaveDoctorApplication() {
        // Given
        DoctorFormDto formDto = new DoctorFormDto();
        formDto.setSubject("Cardiology");
        formDto.setHospital("Good Hospital");
        formDto.setDoctorNumber("D12345");

        when(userRepository.findByUserId("testUser")).thenReturn(Optional.of(testUser));
        when(doctorRepository.save(any(Doctor.class))).thenReturn(testDoctor);

        // When
        Doctor savedDoctor = doctorService.saveDoctorApplication(formDto, "testUser");

        // Then
        assertNotNull(savedDoctor);
        assertEquals("Cardiology", savedDoctor.getSubject());
        assertEquals("Good Hospital", savedDoctor.getHospital());
        verify(doctorRepository, times(1)).save(any(Doctor.class));
    }

    @Test
    @Commit // DB에 저장된 결과 확인 가능
    void testGetDoctorApplication() {
        // Given
        when(doctorRepository.findByUser_UserId("testUser")).thenReturn(Optional.of(testDoctor));

        // When
        Doctor foundDoctor = doctorService.getDoctorApplication("testUser");

        // Then
        assertNotNull(foundDoctor);
        assertEquals("D12345", foundDoctor.getDoctorNumber());
    }

    @Test
    @Commit // 승인 후 DB에서 상태값 변경 확인 가능
    void testApproveDoctorApplication() {
        // Given
        when(doctorRepository.findByUser_UserId("testUser")).thenReturn(Optional.of(testDoctor));

        // When
        doctorService.approveDoctorApplication("testUser");

        // Then
        assertEquals(Status.APPROVED, testDoctor.getStatus());
        assertEquals(Role.DOCTOR, testUser.getRole());
        verify(userRepository, times(1)).save(testUser);
        verify(doctorRepository, times(1)).save(testDoctor);
    }
}
