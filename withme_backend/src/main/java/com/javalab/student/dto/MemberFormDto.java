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
 * - 회원가입 폼 데이터를 전달하는 DTO 클래스
 * - 서비스 레이어에서 Entity로 변환하여 저장되고
 *   서비스에서 전달받은 Entity를 컨트롤러로 전달할 때 사용.
 * - DTO는 Entity와 다르게 데이터 전달만을 위한 클래스이다.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberFormDto {

    @NotBlank(message = "이름을 입력해주세요.")
    private String userName; // ✅ `username` → `userName`으로 수정 (Member 엔티티 반영)

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(regexp = "^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$", message = "유효한 이메일 형식으로 입력해주세요.")
    private String email;

    // 비밀번호는 회원가입 시에만 사용 (정보 수정 시에는 제외)
    @Length(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하로 입력해주세요.") // ✅ 보안 강화
    private String password;

    @NotBlank(message = "주소를 입력해주세요.")
    private String address;

    @NotBlank(message = "연락처를 입력하세요.")
    @Pattern(
            regexp = "^010-\\d{4}-\\d{4}$",
            message = "연락처는 010-XXXX-XXXX 형식이어야 합니다."
    )
    private String phone;

    private Role role;

    private boolean social;   // ✅ 소셜 로그인 여부 추가
    private String provider;  // ✅ 소셜 로그인 제공자 추가 (예: "kakao", "google")

    /**
     * MemberFormDto -> Member Entity 변환 메서드
     * @param memberFormDto MemberFormDto 객체
     * @param passwordEncoder PasswordEncoder 객체
     * @return Member 엔티티 객체
     */
    public static Member toEntity(MemberFormDto memberFormDto, PasswordEncoder passwordEncoder) {
        return Member.builder()
                .userName(memberFormDto.getUserName())  // ✅ 필드명 변경 반영
                .email(memberFormDto.getEmail())
                .password(passwordEncoder.encode(memberFormDto.getPassword())) // 비밀번호 암호화
                .address(memberFormDto.getAddress())
                .phone(memberFormDto.getPhone())
                .role(memberFormDto.getRole() != null ? memberFormDto.getRole() : Role.USER) // 기본 권한 USER
                .social(memberFormDto.isSocial()) // ✅ 소셜 여부 반영
                .provider(memberFormDto.getProvider()) // ✅ 소셜 제공자 정보 반영
                .build();
    }
}
