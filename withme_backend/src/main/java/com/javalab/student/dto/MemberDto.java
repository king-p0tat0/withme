package com.javalab.student.dto;

import com.javalab.student.constant.Role;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MemberDto {

    private Long id;          // ✅ user_id
    private String userName;  // ✅ 기존 name → userName으로 변경 (Member 엔티티 반영)
    private String email;
    private String phone;
    private String address;
    private Role role;
    private boolean social;   // ✅ 소셜 로그인 여부 추가
    private String provider;  // ✅ 소셜 로그인 제공자 추가 (예: "kakao", "google")
}
