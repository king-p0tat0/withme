package com.javalab.student.controller;

import com.javalab.student.dto.QuestionnaireDTO;
import com.javalab.student.service.QuestionnaireService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 📌 문진(Questionnaire) 컨트롤러
 * - 문진 결과 조회 및 저장을 처리하는 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    @Autowired
    public QuestionnaireController(QuestionnaireService questionnaireService) {
        this.questionnaireService = questionnaireService;
    }

    /**
     * ✅ 모든 문진 조회
     */
    @GetMapping
    public ResponseEntity<List<QuestionnaireDTO>> getAllQuestionnaires() {
        return ResponseEntity.ok(questionnaireService.getAllQuestionnaires());
    }

    /**
     * ✅ 특정 문진 ID 조회
     */
    @GetMapping("/{questionnaireId}")
    public ResponseEntity<QuestionnaireDTO> getQuestionnaireById(@PathVariable Long questionnaireId) {
        Optional<QuestionnaireDTO> questionnaire = questionnaireService.getQuestionnaireById(questionnaireId);
        return questionnaire.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * ✅ 특정 유저의 모든 문진 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuestionnaireDTO>> getQuestionnairesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(questionnaireService.getQuestionnairesByUserId(userId));
    }

    /**
     * ✅ 특정 유저의 최신 무료 문진 조회
     */
    @GetMapping("/free/latest/{userId}")
    public ResponseEntity<QuestionnaireDTO> getLatestFreeSurvey(@PathVariable Long userId) {
        return questionnaireService.getLatestFreeSurvey(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * ✅ 특정 유저의 최신 유료 문진 조회
     */
    @GetMapping("/paid/latest/{userId}")
    public ResponseEntity<QuestionnaireDTO> getLatestPaidSurvey(@PathVariable Long userId) {
        return questionnaireService.getLatestPaidSurvey(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * ✅ 새로운 무료 문진 생성 (FREE Survey)
     */
    /*@PostMapping("/free")
    public ResponseEntity<QuestionnaireDTO> createFreeQuestionnaire(
            @RequestBody QuestionnaireDTO questionnaireDTO) {  // ✅ @RequestParam → @RequestBody 변경
        QuestionnaireDTO savedQuestionnaire = questionnaireService.createFreeQuestionnaire(questionnaireDTO);
        return ResponseEntity.ok(savedQuestionnaire);
    }

    *//**
     * ✅ 새로운 유료 문진 생성 (PAID Survey)
     *//*
    @PostMapping("/paid")
    public ResponseEntity<QuestionnaireDTO> createPaidQuestionnaire(
            @RequestBody QuestionnaireDTO questionnaireDTO) {  // ✅ @RequestParam → @RequestBody 변경
        QuestionnaireDTO savedQuestionnaire = questionnaireService.createPaidQuestionnaire(questionnaireDTO);
        return ResponseEntity.ok(savedQuestionnaire);
    }*/

    /**
     * ✅ 문진 삭제
     */
    @DeleteMapping("/{questionnaireId}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long questionnaireId) {
        questionnaireService.deleteQuestionnaire(questionnaireId);
        return ResponseEntity.noContent().build();
    }
}
