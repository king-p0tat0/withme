package com.javalab.student.service;

import com.javalab.student.entity.Member;
import com.javalab.student.entity.Questionnaire;
import com.javalab.student.repository.QuestionnaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 📌 문진(Questionnaire) 서비스
 * - 문진 생성, 조회, 삭제 기능을 제공
 */
@Service
@RequiredArgsConstructor  // ✅ 생성자 주입 자동 생성
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final MemberService memberService;  // ✅ MemberService 주입 추가
    //private final PetService petService;  // ✅ PetService 주입 추가 (반려견 조회)

    /**
     * ✅ 모든 문진 조회
     */
    @Transactional(readOnly = true)
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    /**
     * ✅ 문진 ID로 특정 문진 조회
     */
    @Transactional(readOnly = true)
    public Optional<Questionnaire> getQuestionnaireById(Long questionnaireId) {
        return questionnaireRepository.findById(questionnaireId);
    }

    /**
     * ✅ 특정 유저의 문진 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Questionnaire> getQuestionnairesByUserId(Long userId) {
        return questionnaireRepository.findAllByUser_Id(userId);  // ✅ `User_Id`로 수정
    }

    /**
     * ✅ 특정 유저의 무료 문진 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Questionnaire> getFreeSurveyResults(Long userId) {
        return questionnaireRepository.findAllByUser_IdAndSurveyType(userId, "FREE"); // ✅ 수정된 메서드
    }


    /**
     * ✅ 특정 유저의 유료 문진 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Questionnaire> getPaidSurveyResults(Long userId) {
        return questionnaireRepository.findAllByUser_IdAndSurveyType(userId, "PAID"); // ✅ 수정된 메서드
    }


    /**
     *특정 사용자의 최신 문진 관련
     */

    @Transactional(readOnly = true)
    public Optional<Questionnaire> getLatestFreeSurvey(Long userId) {
        return questionnaireRepository.findTopByUser_IdAndSurveyTypeOrderByCreatedAtDesc(userId, "FREE");
    }

    @Transactional(readOnly = true)
    public Optional<Questionnaire> getLatestPaidSurvey(Long userId) {
        return questionnaireRepository.findTopByUser_IdAndSurveyTypeOrderByCreatedAtDesc(userId, "PAID");
    }


    /**
     * ✅ 새로운 문진 생성 (반려동물 추가 포함)
     */
    @Transactional
    public Questionnaire createQuestionnaire(Questionnaire questionnaire, Long userId, Long petId) {
        // ✅ 존재하는 사용자 조회 (없으면 예외 발생)
        Member user = memberService.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다. userId: " + userId);
        }

        // ✅ 존재하는 반려동물 조회 (없으면 예외 발생 가능)
        //Pet pet = petService.findById(petId);
        //if (pet == null) {
        //    throw new IllegalArgumentException("존재하지 않는 반려동물입니다. petId: " + petId);
        //}

        questionnaire.setUser(user);  // ✅ 사용자 설정
        //questionnaire.setPet(pet);  // ✅ 반려동물 설정

        return questionnaireRepository.save(questionnaire);
    }

    /**
     * ✅ 문진 삭제
     */
    @Transactional
    public void deleteQuestionnaire(Long questionnaireId) {
        questionnaireRepository.deleteById(questionnaireId);
    }
}
