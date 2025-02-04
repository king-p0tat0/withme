package com.javalab.student.controller;

import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.service.UserSelectedTopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<UserSelectedTopics>> getUserSelectedTopics(@PathVariable String userId) {
        return ResponseEntity.ok(userSelectedTopicsService.getUserSelectedTopics(userId));
    }

    /**
     * 새로운 유저 주제 선택
     */
    @PostMapping
    public ResponseEntity<UserSelectedTopics> createUserSelectedTopics(@RequestBody UserSelectedTopics userSelectedTopics) {
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
}
