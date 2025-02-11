package com.javalab.student.repository;

import com.javalab.student.constant.Role;
import com.javalab.student.constant.Status;
import com.javalab.student.dto.MemberFormDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.Member;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
        MemberFormDto memberFormDto = MemberFormDto.builder()
                .name(name)
                .email(email)
                .password(password)
                .address(address)
                .phone(phone)
                .role(role)
                .build();
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

    /**
     * 더미 데이터 추가
     */
    private void insertDummyData() {
        List<Member> members = generateMembers();
        List<Doctor> doctors = generateDoctors(members);

        memberRepository.saveAll(members);
        doctorRepository.saveAll(doctors);
    }

    /**
     * 일반 사용자 및 의사 회원 생성
     */
    private List<Member> generateMembers() {
        List<Member> members = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> createMember("사용자" + i, "user" + i + "@example.com", "1234",
                        "서울시 어딘가 " + i, "010-1234-56" + String.format("%02d", i), Role.USER))
                .collect(Collectors.toList());

        members.addAll(IntStream.rangeClosed(1, 10)
                .mapToObj(i -> createMember("의사" + i, "doctor" + i + "@example.com", "1234",
                        "서울시 병원가 " + i, "010-5678-90" + String.format("%02d", i), Role.DOCTOR))
                .collect(Collectors.toList()));

        members.addAll(IntStream.rangeClosed(1, 2)
                .mapToObj(i -> createMember("관리자" + i, "admin" + i + "@example.com", "1234",
                        "서울시 본사 " + i, "010-9999-88" + i, Role.ADMIN))
                .collect(Collectors.toList()));

        return members;
    }

    /**
     * 의사 객체 생성
     */
    private List<Doctor> generateDoctors(List<Member> members) {
        return members.stream()
                .filter(member -> member.getRole() == Role.DOCTOR)
                .map(member -> createDoctor(member, "과목" + (members.indexOf(member) + 1),
                        "병원" + (members.indexOf(member) + 1), "D" + String.format("%03d", members.indexOf(member) + 1)))
                .collect(Collectors.toList());
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
        Member member = createMember("한의사", "doc2@example.com", "1234", "부산시 해운대구", "010-3333-4444", Role.DOCTOR);
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
        Member member = createMember("외과의사", "doc3@example.com", "1234", "대구시 중구", "010-5555-6666", Role.DOCTOR);
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
        Member member = createMember("치과의사", "doc4@example.com", "1234", "인천시 남동구", "010-7777-8888", Role.DOCTOR);
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
