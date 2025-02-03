package com.javalab.student.service;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

    @InjectMocks
    private DoctorService doctorService;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private UserRepository userRepository;

    private User mockUser;
    private Doctor mockDoctor;
    private DoctorFormDto doctorFormDto;

    @BeforeEach
    void setUp() {
        // Mock User 객체 생성
        mockUser = User.builder()
                .id(1L)
                .userId("testUser")
                .role(Role.USER)
                .build();

        // Mock DoctorFormDto 객체 생성
        doctorFormDto = DoctorFormDto.builder()
                .subject("Cardiology")
                .hospital("Test Hospital")
                .doctorNumber("12345")
                .build();

        // Mock Doctor 객체 생성
        mockDoctor = Doctor.builder()
                .id(1L)
                .user(mockUser)
                .subject(doctorFormDto.getSubject())
                .hospital(doctorFormDto.getHospital())
                .doctorNumber(doctorFormDto.getDoctorNumber())
                .status(Status.PENDING)
                .build();
    }

    @Test
    void saveDoctorApplication_ShouldSaveDoctor() {
        // Given
        when(userRepository.findByUserId("testUser")).thenReturn(mockUser);
        when(doctorRepository.save(any(Doctor.class))).thenReturn(mockDoctor);

        // When
        Doctor savedDoctor = doctorService.saveDoctorApplication(doctorFormDto, "testUser");

        // Then
        assertNotNull(savedDoctor);
        assertEquals("Cardiology", savedDoctor.getSubject());
        verify(doctorRepository, times(1)).save(any(Doctor.class));
    }

    @Test
    void getDoctorApplication_ShouldReturnDoctor() {
        // Given
        when(doctorRepository.findByUserId("testUser")).thenReturn(mockDoctor);

        // When
        Doctor foundDoctor = doctorService.getDoctorApplication("testUser");

        // Then
        assertNotNull(foundDoctor);
        assertEquals("Cardiology", foundDoctor.getSubject());
    }

    @Test
    void updateDoctorApplication_ShouldUpdateDoctorDetails() {
        // Given
        when(doctorRepository.findByUserId("testUser")).thenReturn(mockDoctor);
        when(doctorRepository.save(any(Doctor.class))).thenReturn(mockDoctor);

        // When
        Doctor updatedDoctor = doctorService.updateDoctorApplication("testUser", doctorFormDto);

        // Then
        assertEquals("Cardiology", updatedDoctor.getSubject());
        assertEquals("Test Hospital", updatedDoctor.getHospital());
        verify(doctorRepository, times(1)).save(any(Doctor.class));
    }

    @Test
    void deleteDoctorApplication_ShouldDeleteDoctor() {
        // Given
        when(doctorRepository.findByUserId("testUser")).thenReturn(mockDoctor);
        doNothing().when(doctorRepository).delete(mockDoctor);

        // When
        doctorService.deleteDoctorApplication("testUser");

        // Then
        verify(doctorRepository, times(1)).delete(mockDoctor);
    }

    @Test
    void approveDoctorApplication_ShouldUpdateDoctorStatusAndUserRole() {
        // Given
        when(doctorRepository.findByUserId("testUser")).thenReturn(mockDoctor);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(doctorRepository.save(any(Doctor.class))).thenReturn(mockDoctor);

        // When
        doctorService.approveDoctorApplication("testUser");

        // Then
        assertEquals(Role.DOCTOR, mockUser.getRole());
        assertEquals(Status.APPROVED, mockDoctor.getStatus());
        verify(userRepository, times(1)).save(mockUser);
        verify(doctorRepository, times(1)).save(mockDoctor);
    }
}
