package com.javalab.student.controller;

import com.javalab.student.entity.Response;
import com.javalab.student.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 응답 컨트롤러
 * 설문에 대한 유저의 응답 요청을 처리하는 REST API 컨트롤러
 */

@RestController
@RequestMapping("/api/responses")
@Validated
public class ResponseController {

    private final ResponseService responseService;

    @Autowired
    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    /**
     * 모든 응답 조회
     */
    @GetMapping
    public ResponseEntity<List<Response>> getAllResponses() {
        return ResponseEntity.ok(responseService.getAllResponses());
    }

    /**
     * 응답 ID로 응답 조회
     */
    @GetMapping("/{responseId}")
    public ResponseEntity<Response> getResponseById(@PathVariable Long responseId) {
        Optional<Response> response = responseService.getResponseById(responseId);
        return response.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 새로운 응답 생성
     */
    @PostMapping
    public ResponseEntity<Response> createResponse(@RequestBody Response response) {
        return ResponseEntity.ok(responseService.createResponse(response));
    }

    /**
     * 응답 삭제
     */
    @DeleteMapping("/{responseId}")
    public ResponseEntity<Void> deleteResponse(@PathVariable Long responseId) {
        responseService.deleteResponse(responseId);
        return ResponseEntity.noContent().build();
    }

    // 예외 처리 - 유효하지 않은 응답 생성 요청
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body("잘못된 요청: " + ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
    }
}
