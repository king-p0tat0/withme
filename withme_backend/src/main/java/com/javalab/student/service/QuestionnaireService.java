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
 * 문진(Questionnaire) 서비스
 */
@Service
@RequiredArgsConstructor  // ✅ 생성자 주입 자동 생성
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final MemberService memberService;  // ✅ MemberService 주입 추가
    //private final PetService petService;  // ✅ PetService 주입 추가 (반려견 조회)

    /**
     * 모든 문진 조회
     */
    @Transactional(readOnly = true)
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    /**
     * 문진 ID로 문진 조회
     */
    @Transactional(readOnly = true)
    public Optional<Questionnaire> getQuestionnaireById(Long questionnaireId) {
        return questionnaireRepository.findById(questionnaireId);
    }

    /**
     * 특정 유저의 문진 조회
     */
    @Transactional(readOnly = true)
    public List<Questionnaire> getQuestionnairesByUserId(Long userId) {
        return questionnaireRepository.findAllByUser_Id(userId);  // ✅ `User_Id`로 수정
    }

    /**
     * 새로운 문진 생성 (반려견 추가)
     */
    @Transactional
    public Questionnaire createQuestionnaire(Questionnaire questionnaire, Long userId, Long petId) {
        Member user = memberService.findById(userId);  // ✅ 존재하지 않는 경우 예외 발생
        //Pet pet = petService.findById(petId);  // ✅ 반려견 조회 (예외 발생 가능)

        questionnaire.setUser(user);  // ✅ 유저 설정
        //questionnaire.setPet(pet);  // ✅ 반려견 설정

        return questionnaireRepository.save(questionnaire);
    }

    /**
     * 문진 삭제
     */
    @Transactional
    public void deleteQuestionnaire(Long questionnaireId) {
        questionnaireRepository.deleteById(questionnaireId);
    }
}
