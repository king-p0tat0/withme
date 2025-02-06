package com.javalab.student.service;

import com.javalab.student.entity.Response;
import com.javalab.student.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 응답 서비스
 * 설문에 대한 응답을 처리하는 서비스 클래스
 */
@Service
public class ResponseService {

    private final ResponseRepository responseRepository;

    @Autowired
    public ResponseService(ResponseRepository responseRepository){
        this.responseRepository = responseRepository;
    }

    /**
     * 모든 응답 조회 (디버깅용)
     */
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }

    /**
     * 응답 생성
     */
    public Response createResponse(Response response) {
        return responseRepository.save(response);
    }

    /**
     * 특정 userId 기반으로 응답 조회
     */
    public List<Response> getResponsesByUserId(Long userId) {
        return responseRepository.findByUser_UserId(userId);
    }
}