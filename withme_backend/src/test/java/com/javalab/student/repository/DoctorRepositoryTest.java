package com.javalab.student.repository;

import com.javalab.student.constant.Status;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class DoctorRepositoryTest {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 의사(Doctor)와 사용자(User) 생성 메소드
     */
    private User createUser(String id, String name, String password, String email, String address, String phone) {
        return User.builder()
                .userId(id)
                .userName(name)
                .password(password)
                .email(email)
                .address(address)
                .phone(phone)
                .build();
    }

    private Doctor createDoctor(User user, String subject, String hospital, String doctorNumber) {
        return Doctor.builder()
                .user(user)
                .subject(subject)
                .hospital(hospital)
                .doctorNumber(doctorNumber)
                .status(Status.PENDING)
                .build();
    }

    @Test
    @DisplayName("의사 저장 테스트")
    @Commit
    void saveDoctorTest() {
        // Given
        User user = createUser("doc1", "최강의사", "password123", "doc1@example.com", "서울시 강남구", "010-1111-2222");
        userRepository.save(user);

        Doctor doctor = createDoctor(user, "정형외과", "서울병원", "DOC12345");

        // When
        Doctor savedDoctor = doctorRepository.save(doctor);

        // Then
        assertThat(savedDoctor).isNotNull();
        assertThat(savedDoctor.getUser().getUserId()).isEqualTo("doc1");
        assertThat(savedDoctor.getSubject()).isEqualTo("정형외과");
    }

    @Test
    @DisplayName("의사 조회 테스트")
    void findDoctorByIdTest() {
        // Given
        User user = createUser("doc2", "한의사", "password456", "doc2@example.com", "부산시 해운대구", "010-3333-4444");
        userRepository.save(user);

        Doctor doctor = createDoctor(user, "한의학", "부산한의원", "DOC56789");
        doctorRepository.save(doctor);

        // When
        Optional<Doctor> foundDoctor = doctorRepository.findById(doctor.getDoctorId());

        // Then
        assertThat(foundDoctor).isPresent();
        assertThat(foundDoctor.get().getSubject()).isEqualTo("한의학");
    }

    @Test
    @DisplayName("의사 업데이트 테스트")
    void updateDoctorTest() {
        // Given
        User user = createUser("doc3", "외과의사", "password789", "doc3@example.com", "대구시 중구", "010-5555-6666");
        userRepository.save(user);

        Doctor doctor = createDoctor(user, "외과", "대구병원", "DOC99999");
        Doctor savedDoctor = doctorRepository.save(doctor);

        // When
        savedDoctor.setSubject("신경외과");
        savedDoctor.setHospital("새로운병원");
        Doctor updatedDoctor = doctorRepository.save(savedDoctor);

        // Then
        assertThat(updatedDoctor.getSubject()).isEqualTo("신경외과");
        assertThat(updatedDoctor.getHospital()).isEqualTo("새로운병원");
    }

    @Test
    @DisplayName("의사 삭제 테스트")
    void deleteDoctorTest() {
        // Given
        User user = createUser("doc4", "치과의사", "password000", "doc4@example.com", "인천시 남동구", "010-7777-8888");
        userRepository.save(user);

        Doctor doctor = createDoctor(user, "치과", "인천치과", "DOC33333");
        Doctor savedDoctor = doctorRepository.save(doctor);

        // When
        doctorRepository.deleteById(savedDoctor.getDoctorId());
        Optional<Doctor> deletedDoctor = doctorRepository.findById(savedDoctor.getDoctorId());

        // Then
        assertThat(deletedDoctor).isNotPresent();
    }
}
