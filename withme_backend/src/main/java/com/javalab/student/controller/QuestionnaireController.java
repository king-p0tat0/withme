package com.javalab.student.controller;

import com.javalab.student.entity.Questionnaire;
import com.javalab.student.service.QuestionService;
import com.javalab.student.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 문진 컨트롤러
 * 문진에 대한 요청을 처리하는 REST API 컨트롤러
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
     * 모든 문진 조회
     */
    @GetMapping
    public ResponseEntity<List<Questionnaire>> getAllQuestionnaires() {
        return ResponseEntity.ok(questionnaireService.getAllQuestionnaires());
    }

    /**
     * 문진 ID 로 문진 조회
     */
    @GetMapping("/{questionnaireId}")
    public ResponseEntity<Questionnaire> getQuestionnaireById(@PathVariable Long questionnaireId) {
        Optional<Questionnaire> questionnaire = questionnaireService.getQuestionnaireById(questionnaireId);
        return questionnaire.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 새로운 문진 생성
     */
    @PostMapping
    public ResponseEntity<Questionnaire> createQuestionnaire(@RequestBody Questionnaire questionnaire) {
        return ResponseEntity.ok(questionnaireService.createQuestionnaire(questionnaire));
    }

    /**
     * 문진 삭제
     */
    @DeleteMapping("/{questionnaireId}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long questionnaireId){
        questionnaireService.deleteQuestionnaire(questionnaireId);
        return ResponseEntity.noContent().build();
    }
}
