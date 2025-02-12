package com.javalab.student.dto;

import com.javalab.student.constant.Role;
import com.javalab.student.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 회원가입 폼 DTO
 */
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberFormDto {

    @NotBlank(message = "이름을 입력해주세요.")
    private String name;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(regexp = "^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$", message = "유효한 이메일 형식으로 입력해주세요.")
    private String email;

    // 회원가입 시에만 사용 (정보 수정 시에는 제외)
    @Length(min = 4, max = 16, message = "비밀번호는 4자 이상 16자 이하로 입력해주세요.")
    private String password;

    @NotBlank(message = "주소를 입력해주세요.")
    private String address;

    @NotBlank(message = "연락처를 입력하세요.")
    @Pattern(
            regexp = "^010-\\d{4}-\\d{4}$",
            message = "Phone number should be in the format 010-XXXX-XXXX"
    )
    private String phone;

    private Role role;

    /**
     * 회원가입 전용 DTO에서 MemberFormDto로 변환
     */
    /**
     * MemberFormDto -> Member Entity 변환 메서드
     * @param memberFormDto MemberFormDto 객체
     * @param passwordEncoder PasswordEncoder 객체
     * @return Member 엔티티 객체
     */
    public static Member toEntity(MemberFormDto memberFormDto, PasswordEncoder passwordEncoder) {
        return Member.builder()
                .name(memberFormDto.getName())
                .email(memberFormDto.getEmail())
                .password(passwordEncoder.encode(memberFormDto.getPassword())) // 비밀번호 암호화
                .address(memberFormDto.getAddress())
                .phone(memberFormDto.getPhone())
                .role(memberFormDto.getRole() != null ? memberFormDto.getRole() : Role.USER) // 기본 권한 USER
                .social(false) // 일반 회원가입으로 설정
                .build();
    }

    /**
     * 정보 수정 전용 DTO에서 MemberFormDto로 변환
     */
    public static MemberFormDto forUpdate(MemberFormDto formDto) {
        MemberFormDto updateDto = new MemberFormDto();
        updateDto.setName(formDto.getName());
        updateDto.setAddress(formDto.getAddress());
        updateDto.setPhone(formDto.getPhone());
        return updateDto;
    }
}
