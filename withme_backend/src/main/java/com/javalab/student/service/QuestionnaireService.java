package com.javalab.student.service;

import com.javalab.student.dto.QuestionnaireDTO;
import com.javalab.student.entity.Member;
import com.javalab.student.entity.Questionnaire;
import com.javalab.student.entity.Survey;
import com.javalab.student.repository.QuestionnaireRepository;
import com.javalab.student.repository.SurveyRepository;
import com.javalab.student.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 📌 문진(Questionnaire) 서비스
 * - 문진 생성, 조회, 삭제 기능을 제공
 */
@Service
@RequiredArgsConstructor
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final MemberRepository memberRepository;
    private final SurveyRepository surveyRepository;

    /**
     * ✅ 모든 문진 조회
     */
    @Transactional(readOnly = true)
    public List<QuestionnaireDTO> getAllQuestionnaires() {
        return questionnaireRepository.findAll()
                .stream()
                .map(QuestionnaireDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * ✅ 특정 문진 ID 조회
     */
    @Transactional(readOnly = true)
    public Optional<QuestionnaireDTO> getQuestionnaireById(Long questionnaireId) {
        return questionnaireRepository.findById(questionnaireId)
                .map(QuestionnaireDTO::fromEntity);
    }

    /**
     * ✅ 특정 유저의 최신 무료 문진 조회
     */
    @Transactional(readOnly = true)
    public Optional<QuestionnaireDTO> getLatestFreeSurvey(Long userId) {
        Optional<Questionnaire> latestSurvey = questionnaireRepository.findTopByUser_IdAndSurveyTypeOrderByCreatedAtDesc(userId, "FREE");

        if (latestSurvey.isEmpty()) {
            System.out.println("❌ [getLatestFreeSurvey] userId: " + userId + "에 대한 무료 문진이 존재하지 않습니다.");
            return Optional.empty();
        }

        return Optional.of(QuestionnaireDTO.fromEntity(latestSurvey.get()));
    }

    /**
     * ✅ 특정 유저의 최신 유료 문진 조회
     */
    @Transactional(readOnly = true)
    public Optional<QuestionnaireDTO> getLatestPaidSurvey(Long userId) {
        Optional<Questionnaire> latestSurvey = questionnaireRepository.findTopByUser_IdAndSurveyTypeOrderByCreatedAtDesc(userId, "PAID");

        if (latestSurvey.isEmpty()) {
            System.out.println("❌ [getLatestPaidSurvey] userId: " + userId + "에 대한 유료 문진이 존재하지 않습니다.");
            return Optional.empty();
        }

        return Optional.of(QuestionnaireDTO.fromEntity(latestSurvey.get()));
    }

    /**
     * ✅ 특정 유저의 모든 문진 조회
     */
    @Transactional(readOnly = true)
    public List<QuestionnaireDTO> getQuestionnairesByUserId(Long userId) {
        List<Questionnaire> questionnaires = questionnaireRepository.findAllByUser_Id(userId);

        if (questionnaires.isEmpty()) {
            System.out.println("❌ [getQuestionnairesByUserId] userId: " + userId + "에 대한 문진 기록이 없습니다.");
        }

        return questionnaires.stream()
                .map(QuestionnaireDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * ✅ 새로운 무료 문진 생성
     */
    @Transactional
    public QuestionnaireDTO createFreeQuestionnaire(Long userId, Long surveyId) {
        return createQuestionnaire(userId, surveyId, "FREE");
    }

    /**
     * ✅ 새로운 유료 문진 생성
     */
    @Transactional
    public QuestionnaireDTO createPaidQuestionnaire(Long userId, Long surveyId) {
        return createQuestionnaire(userId, surveyId, "PAID");
    }

    /**
     * ✅ 문진 생성 공통 메서드
     */
    private QuestionnaireDTO createQuestionnaire(Long userId, Long surveyId, String surveyType) {
        // ✅ 존재하는 사용자 조회 (없으면 예외 발생)
        Member user = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 존재하지 않는 사용자입니다. userId: " + userId));

        // ✅ 존재하는 설문 조회 (없으면 예외 발생)
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 존재하지 않는 설문입니다. surveyId: " + surveyId));

        // ✅ 새로운 문진 생성
        Questionnaire questionnaire = Questionnaire.builder()
                .user(user)
                .survey(survey)
                .surveyType(surveyType)
                .responseStatus(Questionnaire.ResponseStatus.IN_PROGRESS)
                .score(0)
                .build();

        questionnaireRepository.save(questionnaire);

        System.out.println("✅ [createQuestionnaire] userId: " + userId + ", surveyId: " + surveyId + " 문진 생성 완료!");
        return QuestionnaireDTO.fromEntity(questionnaire);
    }

    /**
     * ✅ 문진 삭제
     */
    @Transactional
    public void deleteQuestionnaire(Long questionnaireId) {
        if (!questionnaireRepository.existsById(questionnaireId)) {
            System.out.println("❌ [deleteQuestionnaire] questionnaireId: " + questionnaireId + "가 존재하지 않습니다.");
            throw new IllegalArgumentException("존재하지 않는 문진입니다. questionnaireId: " + questionnaireId);
        }

        questionnaireRepository.deleteById(questionnaireId);
        System.out.println("✅ [deleteQuestionnaire] questionnaireId: " + questionnaireId + " 문진 삭제 완료!");
    }
}
