package com.javalab.student.controller;

import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.service.UserSelectedTopicsService;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 📌 유저가 선택한 주제 컨트롤러
 * - userId 기반 주제 선택 관리
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
     * ✅ 특정 userId 기반 선택한 주제 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserSelectedTopics>> getUserSelectedTopics(@PathVariable @NotNull Long userId) {
        return ResponseEntity.ok(userSelectedTopicsService.getSelectedTopicsByUserId(userId));
    }

    /**
     * ✅ 새로운 주제 선택 저장
     */
    @PostMapping("/{userId}/{topicId}")
    public ResponseEntity<UserSelectedTopics> saveUserSelectedTopic(
            @PathVariable Long userId,
            @PathVariable Long topicId) {
        return ResponseEntity.ok(userSelectedTopicsService.saveUserSelectedTopic(userId, topicId));
    }

    /**
     * ✅ 특정 userId와 topicId 기반 주제 삭제
     */
    @DeleteMapping("/{userId}/{topicId}")
    public ResponseEntity<Void> deleteUserSelectedTopic(@PathVariable Long userId, @PathVariable Long topicId) {
        userSelectedTopicsService.deleteUserSelectedTopic(userId, topicId);
        return ResponseEntity.noContent().build();
    }
}