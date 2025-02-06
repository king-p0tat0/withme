package com.javalab.student.service;

import com.javalab.student.entity.Questionnaire;
import com.javalab.student.repository.QuestionnaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 문진(Questionnaire) 서비스
 */
@Service
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;

    @Autowired
    public QuestionnaireService(QuestionnaireRepository questionnaireRepository) {
        this.questionnaireRepository = questionnaireRepository;
    }

    /**
     * 모든 문진 조회
     */
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    /**
     * 문진 ID로 문진 조회
     */
    public Optional<Questionnaire> getQuestionnaireById(Long questionnaireId) {
        return questionnaireRepository.findById(questionnaireId);
    }

    /**
     * 특정 유저의 문진 조회
     */
    public List<Questionnaire> getQuestionnairesByUserId(Long userId) {
        return questionnaireRepository.findAllByUser_UserId(userId);
    }

    /**
     * 새로운 문진 생성
     */
    public Questionnaire createQuestionnaire(Questionnaire questionnaire) {
        return questionnaireRepository.save(questionnaire);
    }

    /**
     * 문진 삭제
     */
    public void deleteQuestionnaire(Long questionnaireId) {
        questionnaireRepository.deleteById(questionnaireId);
    }
}
