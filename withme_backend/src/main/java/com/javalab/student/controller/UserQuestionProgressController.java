package com.javalab.student.controller;

import com.javalab.student.entity.UserQuestionProgress;
import com.javalab.student.service.UserQuestionProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 유저 문진 진행 컨트롤러
 * 유저의 문진 진행 상태에 대한 요청을 처리하는 REST API 컨트롤러
 */

@RestController
@RequestMapping("/api/user-question-progress")
public class UserQuestionProgressController {

    private final UserQuestionProgressService userQuestionProgressService;

    @Autowired
    public UserQuestionProgressController(UserQuestionProgressService userQuestionProgressService) {
        this.userQuestionProgressService = userQuestionProgressService;
    }

    /**
     * 유저 문진 진행 상태 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserQuestionProgress> createUserQuestionProgress(@RequestBody UserQuestionProgress userQuestionProgress) {
        return ResponseEntity.ok(userQuestionProgressService.createUserQuestionProgress(userQuestionProgress));
    }

    /**
     * 유저 문진 진행 상태 삭제
     */
    @DeleteMapping("/{userId}/{questionnaireId}/{questionId}")
    public ResponseEntity<Void> deleteUserQuestionProgress(@PathVariable String userId, @PathVariable Long questionnaireId, @PathVariable Long questionId) {
        userQuestionProgressService.deleteUserQuestionProgress(userId, questionnaireId,questionId);
        return ResponseEntity.noContent().build();
    }


}
