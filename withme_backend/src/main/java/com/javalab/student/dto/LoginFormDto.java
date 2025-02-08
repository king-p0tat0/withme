package com.javalab.student.dto;

import lombok.*;

/**
 * 로그인 요청 DTO
 * 사용자가 로그인할 때 필요한 데이터를 담는 객체
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginFormDto {
    private String email;    // 사용자 이메일 (로그인 ID)
    private String password; // 비밀번호
}
