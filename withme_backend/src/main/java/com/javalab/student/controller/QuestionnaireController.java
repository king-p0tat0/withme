package com.javalab.student.controller;

import com.javalab.student.dto.QuestionnaireDTO;
import com.javalab.student.entity.Questionnaire;
import com.javalab.student.service.QuestionnaireService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * ✅ 모든 문진 조회 (디버깅용)
     */
    @GetMapping
    public ResponseEntity<List<QuestionnaireDTO>> getAllQuestionnaires() {
        List<QuestionnaireDTO> questionnaireDTOs = questionnaireService.getAllQuestionnaires()
                .stream()
                .map(QuestionnaireDTO::fromEntity) // ✅ Entity → DTO 변환
                .collect(Collectors.toList());
        return ResponseEntity.ok(questionnaireDTOs);
    }

    /**
     * ✅ 특정 questionnaireId 기반으로 문진 조회
     */
    @GetMapping("/{questionnaireId}")
    public ResponseEntity<QuestionnaireDTO> getQuestionnaireById(@PathVariable @NotNull Long questionnaireId) {
        Optional<Questionnaire> questionnaire = questionnaireService.getQuestionnaireById(questionnaireId);
        return questionnaire.map(q -> ResponseEntity.ok(QuestionnaireDTO.fromEntity(q)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * ✅ 특정 userId 기반으로 모든 문진 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuestionnaireDTO>> getQuestionnairesByUserId(@PathVariable Long userId) {
        List<QuestionnaireDTO> questionnaireDTOs = questionnaireService.getQuestionnairesByUserId(userId)
                .stream()
                .map(QuestionnaireDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(questionnaireDTOs);
    }

    /**
     * ✅ 특정 userId 기반으로 최신 무료 문진 결과 조회
     */
    @GetMapping("/free/latest/{userId}")
    public ResponseEntity<QuestionnaireDTO> getLatestFreeSurvey(@PathVariable Long userId) {
        Optional<Questionnaire> latestFreeSurvey = questionnaireService.getLatestFreeSurvey(userId);
        return latestFreeSurvey.map(q -> ResponseEntity.ok(QuestionnaireDTO.fromEntity(q)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    /**
     * ✅ 특정 userId 기반으로 최신 유료 문진 결과 조회
     */
    @GetMapping("/paid/latest/{userId}")
    public ResponseEntity<QuestionnaireDTO> getLatestPaidSurvey(@PathVariable Long userId) {
        Optional<Questionnaire> latestPaidSurvey = questionnaireService.getLatestPaidSurvey(userId);
        return latestPaidSurvey.map(q -> ResponseEntity.ok(QuestionnaireDTO.fromEntity(q)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    /**
     * ✅ 새로운 문진 생성 (무료 & 유료 공통)
     */
    @PostMapping
    public ResponseEntity<QuestionnaireDTO> createQuestionnaire(@Valid @RequestBody Questionnaire questionnaire,
                                                                @RequestParam Long userId,
                                                                @RequestParam Long petId) {
        Questionnaire savedQuestionnaire = questionnaireService.createQuestionnaire(questionnaire, userId, petId);
        return ResponseEntity.ok(QuestionnaireDTO.fromEntity(savedQuestionnaire));
    }

    /**
     * ✅ 문진 삭제 (관리자 기능)
     */
    @DeleteMapping("/{questionnaireId}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long questionnaireId) {
        questionnaireService.deleteQuestionnaire(questionnaireId);
        return ResponseEntity.noContent().build();
    }
}
