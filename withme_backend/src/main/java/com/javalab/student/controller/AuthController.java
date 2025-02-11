package com.javalab.student.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.javalab.student.config.jwt.TokenProvider;
import com.javalab.student.entity.Member;
import com.javalab.student.service.MemberService;
import com.javalab.student.service.RefreshTokenService;

import java.util.HashMap;
import java.util.Map;

/**
 * AuthController
 * - 회원 가입 및 사용자 정보 조회를 처리하는 컨트롤러
 * - Spring Security와 JWT를 활용하여 인증 및 권한 관리
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final MemberService memberService;
    private final TokenProvider tokenProvider;

    /**
     * 사용자 정보 조회
     * @param authentication 인증 객체
     * @return 사용자 정보 JSON 응답
     */
    @GetMapping("/userInfo") // api/auth/userInfo
    public ResponseEntity<Map<String, Object>> getUserInfo(Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        // 인증 객체가 없는 경우 처리
        if (authentication == null || !authentication.isAuthenticated()) {
            response.put("status", "error");
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // 인증 객체에서 사용자 이메일 추출
        String email = authentication.getName();

        // 사용자 정보 가져오기
        Member member = memberService.findByEmail(email);
        if (member == null) {
            response.put("status", "error");
            response.put("message", "사용자를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // 사용자 정보 응답
        response.put("status", "success");
        response.put("data", member);
        return ResponseEntity.ok(response);
    }
}
