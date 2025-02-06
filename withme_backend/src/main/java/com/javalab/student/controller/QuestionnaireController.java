package com.javalab.student.controller;

import com.javalab.student.entity.Questionnaire;
import com.javalab.student.service.QuestionnaireService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 문진(Questionnaire) 컨트롤러
 * 문진 결과 조회 및 저장을 처리하는 REST API 컨트롤러
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
     * 모든 문진 조회 (디버깅용)
     */
    @GetMapping
    public ResponseEntity<List<Questionnaire>> getAllQuestionnaires() {
        return ResponseEntity.ok(questionnaireService.getAllQuestionnaires());
    }

    /**
     * 특정 questionnaireId 기반으로 문진 조회
     */
    @GetMapping("/{questionnaireId}")
    public ResponseEntity<Questionnaire> getQuestionnaireById(@PathVariable @NotNull Long questionnaireId) {
        Optional<Questionnaire> questionnaire = questionnaireService.getQuestionnaireById(questionnaireId);
        return questionnaire.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 특정 userId 기반으로 문진 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Questionnaire>> getQuestionnairesByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(questionnaireService.getQuestionnairesByUserId(userId));
    }

    /**
     * 새로운 문진 생성 (무료 & 유료 공통)
     */
    @PostMapping
    public ResponseEntity<Questionnaire> createQuestionnaire(@Valid @RequestBody Questionnaire questionnaire) {
        return ResponseEntity.ok(questionnaireService.createQuestionnaire(questionnaire));
    }

    /**
     * 문진 삭제 (관리자 기능)
     */
    @DeleteMapping("/{questionnaireId}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long questionnaireId) {
        questionnaireService.deleteQuestionnaire(questionnaireId);
        return ResponseEntity.noContent().build();
    }
}