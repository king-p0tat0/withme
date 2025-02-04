package com.javalab.student.controller;

import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.service.UserSelectedTopicsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 유저가 선택한 주제 컨트롤러
 * 유저가 선택한 주제에 대한 요청을 처리하는 REST API 컨트롤러
 */

@RestController
@RequestMapping("/api/user-selected-topics")
public class UserSelectedTopicsController {

    private final UserSelectedTopicsService userSelectedTopicsService;

    @Autowired
    public UserSelectedTopicsController(UserSelectedTopicsService userSelectedTopicsService) {
        this.userSelectedTopicsService = userSelectedTopicsService;
    }

    /**
     * 유저가 선택한 주제 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserSelectedTopics>> getUserSelectedTopics(@PathVariable @NotNull String userId) {
        return ResponseEntity.ok(userSelectedTopicsService.getUserSelectedTopics(userId));
    }

    /**
     * 새로운 유저 주제 선택
     */
    @PostMapping
    public ResponseEntity<UserSelectedTopics> createUserSelectedTopics(@Valid @RequestBody UserSelectedTopics userSelectedTopics) {
        return ResponseEntity.ok(userSelectedTopicsService.createUserSelectedTopics(userSelectedTopics));
    }

    /**
     * 유저가 선택한 주제 삭제
     */
    @DeleteMapping("/{userId}/{topicId}")
    public ResponseEntity<Void> deleteUserSelectedTopics(@PathVariable String userId, @PathVariable Long topicId) {
        userSelectedTopicsService.deleteUserSelectedTopics(userId, topicId);
        return ResponseEntity.noContent().build();
    }

    // 예외 처리 - 유효하지 않은 주제 생성 요청
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body("잘못된 요청: " + ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
    }
}
