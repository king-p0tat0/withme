package com.javalab.student.controller;

import com.javalab.student.entity.ExpertQuestion;
import com.javalab.student.service.ExpertQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 전문가 질문 컨트롤러
 * 전문가 질문에 대한 요청을 처리하는 REST API 컨트롤러
 */

@RestController
@RequestMapping("/api/expert-questions")
public class ExpertQuestionController {

    private final ExpertQuestionService expertQuestionService;

    @Autowired
    public ExpertQuestionController(ExpertQuestionService expertQuestionService) {
        this.expertQuestionService = expertQuestionService;
    }

    /**
     * 모든 전문가 질문 조회
     */
    @GetMapping
    public ResponseEntity<List<ExpertQuestion>> getAllExpertQuestions() {
        return ResponseEntity.ok(expertQuestionService.getAllExpertQuestions());
    }

    /**
     * 전문가 질문 ID로 질문 조회
     */
    @GetMapping("/{expertQuestionId}")
    public ResponseEntity<ExpertQuestion> getExpertQuestionById(@PathVariable Long expertQuestionId) {
        Optional<ExpertQuestion> expertQuestion = expertQuestionService.getExpertQuestionById(expertQuestionId);
        return expertQuestion.map(ResponseEntity::ok)
                .orElseGet(()-> ResponseEntity.notFound().build());
    }

    /**
     * 새로운 전문가 질문 생성
     */
    @PostMapping
    public ResponseEntity<ExpertQuestion> createExpertQuestion(@RequestBody ExpertQuestion expertQuestion) {
        return ResponseEntity.ok(expertQuestionService.createExpertQuestion(expertQuestion));
    }

    /**
     * 전문가 질문 삭제
     */
    @DeleteMapping("/{expertQuestionId}")
    public ResponseEntity<Void> deleteExpertQuestion(@PathVariable Long expertQuestionId) {
        expertQuestionService.deleteExpertQuestion(expertQuestionId);
        return ResponseEntity.noContent().build();
    }
}
