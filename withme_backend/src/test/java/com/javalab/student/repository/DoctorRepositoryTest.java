package com.javalab.student.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import com.javalab.student.constant.Role;
import com.javalab.student.constant.Status;
import com.javalab.student.dto.MemberFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.Member;
import com.javalab.student.repository.DoctorRepository;
import com.javalab.student.repository.MemberRepository;

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
    private MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Member 생성 메소드
     */
    private Member createMember(String name, String email, String password, String address, String phone, Role role) {
        MemberFormDto memberFormDto = new MemberFormDto();
        memberFormDto.setName(name);
        memberFormDto.setEmail(email);
        memberFormDto.setPassword(password);
        memberFormDto.setAddress(address);
        memberFormDto.setPhone(phone);
        memberFormDto.setRole(role);

        return Member.createMember(memberFormDto, passwordEncoder);
    }

    /**
     * Doctor 생성 메소드
     */
    private Doctor createDoctor(Member member, String subject, String hospital, String doctorNumber) {
        return Doctor.builder()
                .member(member)
                .subject(subject)
                .hospital(hospital)
                .doctorNumber(doctorNumber)
                .status(Status.PENDING)
                .build();
    }

    /* 더미 데이터 추가 */
    public void insertDummyData() {
        List<Member> members = new ArrayList<>();
        List<Doctor> doctors = new ArrayList<>();

        // 일반 사용자 10명 추가
        for (int i = 1; i <= 10; i++) {
            Member member = createMember(
                    "사용자" + i, "user" + i + "@example.com", "1234",
                    "서울시 어딘가 " + i, "010-1234-56" + String.format("%02d", i),
                    Role.USER
            );
            members.add(member);
        }

        // 의사 10명 추가
        for (int i = 1; i <= 10; i++) {
            Member doctorMember = createMember(
                    "의사" + i, "doctor" + i + "@example.com", "1234",
                    "서울시 병원가 " + i, "010-5678-90" + String.format("%02d", i),
                    Role.DOCTOR
            );
            members.add(doctorMember);

            Doctor doctor = createDoctor(doctorMember, "과목" + i, "병원" + i, "D" + String.format("%03d", i));
            doctors.add(doctor);
        }

        // 관리자 2명 추가
        for (int i = 1; i <= 2; i++) {
            Member admin = createMember(
                    "관리자" + i, "admin" + i + "@example.com", "1234",
                    "서울시 본사 " + i, "010-9999-88" + i,
                    Role.ADMIN
            );
            members.add(admin);
        }

        // 저장
        memberRepository.saveAll(members);
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
        Member member = createMember("한의사", "doc2@example.com", "password456", "부산시 해운대구", "010-3333-4444", Role.DOCTOR);
        memberRepository.save(member);

        Doctor doctor = createDoctor(member, "한의학", "부산한의원", "DOC56789");
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
        Member member = createMember("외과의사", "doc3@example.com", "password789", "대구시 중구", "010-5555-6666", Role.DOCTOR);
        memberRepository.save(member);

        Doctor doctor = createDoctor(member, "외과", "대구병원", "DOC99999");
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
        Member member = createMember("치과의사", "doc4@example.com", "password000", "인천시 남동구", "010-7777-8888", Role.DOCTOR);
        memberRepository.save(member);

        Doctor doctor = createDoctor(member, "치과", "인천치과", "DOC33333");
        Doctor savedDoctor = doctorRepository.save(doctor);

        // When
        doctorRepository.deleteById(savedDoctor.getDoctorId());
        Optional<Doctor> deletedDoctor = doctorRepository.findById(savedDoctor.getDoctorId());

        // Then
        assertThat(deletedDoctor).isNotPresent();
    }
}
