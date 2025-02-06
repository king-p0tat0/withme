package com.javalab.student.controller;

import com.javalab.student.dto.*;
import com.javalab.student.entity.Member;
import com.javalab.student.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Log4j2
public class MemberController {

    private final MemberService memberService;

    /**
     * 회원가입 처리
     * @param memberFormDto - 클라이언트에서 전송한 회원가입 데이터
     * @return 성공 메시지 또는 에러 메시지
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerMember(@Valid @RequestBody MemberFormDto memberFormDto) {
        try {
            memberService.registerMember(memberFormDto);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * 이메일 중복 체크
     * @param email - 클라이언트에서 입력받은 이메일
     * @return 중복 여부
     */
    @GetMapping("/checkEmail")
    public ResponseEntity<Map<String, String>> checkEmail(@RequestParam("email") String email) {
        Map<String, String> response = new HashMap<>();
        if (memberService.isEmailDuplicate(email)) {
            response.put("message", "이미 존재하는 이메일입니다.");
            response.put("status", "duplicate");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        response.put("message", "사용 가능한 이메일입니다.");
        response.put("status", "available");
        return ResponseEntity.ok(response);
    }

    /**
     * 로그인 처리[미사용-일반 시큐리티 로그인]
     * @param loginForm - 클라이언트에서 전송한 로그인 데이터
     * @return 성공 메시지 또는 에러 메시지
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginMember(@RequestBody LoginFormDto loginForm) {
        Map<String, String> response = new HashMap<>();

        // 로그인 성공 여부 확인
        boolean isLoginSuccessful = memberService.login(loginForm);

        if (isLoginSuccessful) {
            response.put("message", "로그인 성공");
            response.put("status", "success");
            return ResponseEntity.ok(response); // HTTP 200 OK
        }

        // 로그인 실패 처리
        response.put("message", "로그인 실패");
        response.put("status", "failed");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); // HTTP 401 Unauthorized
    }

    // 페이징 처리된 유저 목록 조회
    @GetMapping("/list")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponseDTO<MemberDto>> getAllmembers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();
        log.info("페이지 : " + pageRequestDTO.getPage() + " " + pageRequestDTO.getSize());

        PageResponseDTO<MemberDto> responseDTO = memberService.getAllMembers(pageRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

}
