package com.javalab.student.controller;

import com.javalab.student.dto.QuestionDTO;
import com.javalab.student.entity.Question;
import com.javalab.student.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questionDTOs = questionService.getAllQuestions();
        return ResponseEntity.ok(questionDTOs);
    }



    /**
     * ✅ 질문 ID로 질문 조회
     */
    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long questionId) {
        Optional<QuestionDTO> question = questionService.getQuestionById(questionId);
        return question.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    /**
     * 특정 문진 설문의 질문 목록 조회 (선택지 포함)
     */
    @GetMapping("/free/{surveyId}")
    public ResponseEntity<List<QuestionDTO>> getFreeQuestionsBySurveyId(@PathVariable("surveyId") Long surveyId) {
        List<QuestionDTO> questionDTOs = questionService.getFreeSurveyQuestions(surveyId);

        // ✅ 응답이 비어 있는 경우 404 처리
        if (questionDTOs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(questionDTOs);
    }


    /**
     * ✅ 특정 유저 ID(userId)에 해당하는 질문 조회 (유료 회원 문진 진행)
     */
    @GetMapping("/paid/{userId}")
    public ResponseEntity<List<QuestionDTO>> getPaidQuestionsByUserId(@PathVariable Long userId) {
        List<QuestionDTO> questionDTOs = questionService.getPaidQuestionsByUserId(userId);
        return ResponseEntity.ok(questionDTOs);
    }

}
