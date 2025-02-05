package com.javalab.student.repository;

import com.javalab.student.constant.Role;
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

import java.util.ArrayList;
import java.util.List;
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


    /*더미데이터*/
    public void insertDummyData() {
        List<User> users = new ArrayList<>();
        List<Doctor> doctors = new ArrayList<>();

        // 일반 사용자 10명 추가
        for (int i = 1; i <= 10; i++) {
            User user = createUser(
                    "user" + i, "사용자" + i, "password123",
                    "user" + i + "@example.com", "서울시 어딘가 " + i, "010-1234-56" + String.format("%02d", i)
            );
            user.setRole(Role.USER);
            users.add(user);
        }

        // 의사 10명 추가
        for (int i = 1; i <= 10; i++) {
            User doctorUser = createUser(
                    "doctor" + i, "의사" + i, "password123",
                    "doctor" + i + "@example.com", "서울시 병원가 " + i, "010-5678-90" + String.format("%02d", i)
            );
            doctorUser.setRole(Role.DOCTOR);
            users.add(doctorUser);

            Doctor doctor = createDoctor(doctorUser, "과목" + i, "병원" + i, "D" + String.format("%03d", i));
            doctors.add(doctor);
        }

        // 관리자 2명 추가
        for (int i = 1; i <= 2; i++) {
            User admin = createUser(
                    "admin" + i, "관리자" + i, "password123",
                    "admin" + i + "@example.com", "서울시 본사 " + i, "010-9999-88" + i
            );
            admin.setRole(Role.ADMIN);
            users.add(admin);
        }

        // 저장
        userRepository.saveAll(users);
        doctorRepository.saveAll(doctors);

    }

    @Test
    @DisplayName("의사 저장 테스트")
    @Commit
    void saveDoctorTest() {
        insertDummyData();
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
