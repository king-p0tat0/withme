package com.javalab.student.service;

import com.javalab.student.entity.Survey;
import com.javalab.student.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 설문 서비스
 * 설문에 대한 비지니스 로직을 처리하는 서비스 클래스
 */
@Service
public class SurveyService {

    private final SurveyRepository surveyRepository;

    @Autowired
    public SurveyService(SurveyRepository surveyRepository){
        this.surveyRepository = surveyRepository;

    }

    /**
     * 모든 설문 조회
     */
    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    /**
     *  설문 ID로 설문 조회
     */
    public Optional<Survey> getSurveyById(Long surveyId) {
        return surveyRepository.findById(surveyId);
    }

    /**
     *  새로운 설문 생성
     */
    public Survey createSurvey(Survey survey) {
        return surveyRepository.save(survey);
    }

    /**
     * 설문 삭제
     */
    public void deleteSurvey(Long surveyId) {
        surveyRepository.deleteById(surveyId);
    }
}
