package com.javalab.student.controller;

import com.javalab.student.dto.QuestionDTO;
import com.javalab.student.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 📌 질문 컨트롤러
 * - 무료/유료 문진 질문 API 제공
 */
@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    /**
     * ✅ 모든 질문 조회
     */
    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions().stream()
                .map(QuestionDTO::fromEntity).toList());
    }

    /**
     * ✅ 특정 설문 ID에 해당하는 질문 조회 (무료 문진)
     */
    @GetMapping("/free/{surveyId}")
    public ResponseEntity<List<QuestionDTO>> getFreeSurveyQuestions(@PathVariable Long surveyId) {
        return ResponseEntity.ok(questionService.getFreeSurveyQuestions(surveyId));
    }

    /**
     * ✅ 특정 유저 ID(userId)에 해당하는 질문 조회 (유료 문진)
     */
    @GetMapping("/paid/{userId}")
    public ResponseEntity<List<QuestionDTO>> getPaidSurveyQuestions(@PathVariable Long userId) {
        return ResponseEntity.ok(questionService.getPaidSurveyQuestions(userId));
    }
}
