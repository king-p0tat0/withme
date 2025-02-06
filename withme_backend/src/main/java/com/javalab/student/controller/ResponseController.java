package com.javalab.student.controller;

import com.javalab.student.entity.Response;
import com.javalab.student.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 응답 컨트롤러
 * 설문 응답 관련 요청을 처리하는 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    private final ResponseService responseService;

    @Autowired
    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    /**
     * 모든 응답 조회 (디버깅용)
     */
    @GetMapping
    public ResponseEntity<List<Response>> getAllResponses() {
        return ResponseEntity.ok(responseService.getAllResponses());
    }

    /**
     * 응답 저장
     */
    @PostMapping
    public ResponseEntity<Response> saveResponse(@RequestBody Response response) {
        return ResponseEntity.ok(responseService.createResponse(response));
    }
}