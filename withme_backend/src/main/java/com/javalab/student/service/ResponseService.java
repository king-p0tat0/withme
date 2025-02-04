package com.javalab.student.service;

import com.javalab.student.entity.Response;
import com.javalab.student.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 응답 서비스
 * 설문에 대한 유저 응답에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;

    @Autowired
    public ResponseService(ResponseRepository responseRepository){
        this.responseRepository = responseRepository;
    }

    /**
     * 모든 응답 조회
     */
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }

    /**
     * 응답 ID로 응답 조회
     */
    public Optional<Response> getResponseById(Long responseId) {
        return responseRepository.findById(responseId);
    }

    /**
     * 응답 생성
     */
    public Response createResponse(Response response) {
        return responseRepository.save(response);
    }

    /**
     * 응답 삭제
     */
    public void deleteResponse(Long responseId) {
        responseRepository.deleteById(responseId);
    }
}
