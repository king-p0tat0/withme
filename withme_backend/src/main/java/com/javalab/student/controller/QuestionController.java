package com.javalab.student.controller;

import com.javalab.student.entity.Question;
import com.javalab.student.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 질문(Question) 컨트롤러
 * 설문에 포함된 질문에 대한 요청을 처리하는 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * ✅ 모든 질문 조회
     */
    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    /**
     * ✅ 질문 ID로 질문 조회
     */
    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long questionId) {
        Optional<Question> question = questionService.getQuestionById(questionId);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * ✅ 특정 설문 ID에 해당하는 질문 조회 (무료 문진)
     */
    @GetMapping("/free/{surveyId}")
    public ResponseEntity<List<Question>> getFreeQuestionsBySurveyId(@PathVariable Long surveyId) {
        return ResponseEntity.ok(questionService.getQuestionsBySurveyId(surveyId));
    }

    /**
     * ✅ 특정 유저 ID(userId)에 해당하는 질문 조회 (유료 문진)
     */
    @GetMapping("/paid/{userId}")
    public ResponseEntity<List<Question>> getPaidQuestionsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(questionService.getQuestionsByUserId(userId));
    }
}
