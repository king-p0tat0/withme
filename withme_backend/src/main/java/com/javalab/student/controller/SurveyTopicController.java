package com.javalab.student.controller;

import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.service.SurveyTopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 설문 주제 컨트롤러
 * 설문 주제 관련 요청을 처리하는 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/survey-topics")
@Validated
public class SurveyTopicController {

    private final SurveyTopicService surveyTopicService;

    @Autowired
    public SurveyTopicController(SurveyTopicService surveyTopicService) {
        this.surveyTopicService = surveyTopicService;
    }

    /**
     * ✅ 모든 설문 주제 조회
     */
    @GetMapping
    public ResponseEntity<List<SurveyTopic>> getAllTopics() {
        return ResponseEntity.ok(surveyTopicService.getAllTopics());
    }

    /**
     * ✅ 특정 주제 ID로 조회
     */
    @GetMapping("/{topicId}")
    public ResponseEntity<SurveyTopic> getTopicById(@PathVariable Long topicId) {
        Optional<SurveyTopic> topic = surveyTopicService.getTopicById(topicId);
        return topic.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * ✅ 유료 문진(PAID) 주제 목록 조회 (surveyId 기반)
     */
    @GetMapping("/paid/{surveyId}")
    public ResponseEntity<List<SurveyTopic>> getPaidTopics(@PathVariable Long surveyId) {
        return ResponseEntity.ok(surveyTopicService.getPaidTopics(surveyId));
    }

    /**
     * ✅ 새로운 설문 주제 생성
     */
    @PostMapping
    public ResponseEntity<SurveyTopic> createTopic(@RequestBody SurveyTopic surveyTopic) {
        return ResponseEntity.ok(surveyTopicService.createTopic(surveyTopic));
    }

    /**
     * ✅ 설문 주제 삭제
     */
    @DeleteMapping("/{topicId}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long topicId) {
        surveyTopicService.deleteTopic(topicId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 🚨 예외 처리 - 유효하지 않은 주제 생성 요청
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body("잘못된 요청: " + ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
    }
}
