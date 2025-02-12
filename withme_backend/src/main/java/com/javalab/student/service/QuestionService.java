package com.javalab.student.service;

import com.javalab.student.dto.QuestionDTO;
import com.javalab.student.entity.Question;
import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.repository.QuestionRepository;
import com.javalab.student.repository.UserSelectedTopicsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 📌 질문 서비스 (무료 & 유료 문진)
 */
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserSelectedTopicsRepository userSelectedTopicsRepository;

    /**
     * ✅ 모든 질문 조회
     */
    @Transactional(readOnly = true)
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     * ✅ 특정 질문 ID로 질문 조회
     */
    @Transactional(readOnly = true)
    public Optional<Question> getQuestionById(Long questionId) {
        return questionRepository.findById(questionId);
    }

    /**
     * ✅ 무료 문진 (surveyId 기준 질문 & 선택지 조회)
     */
    @Transactional(readOnly = true)
    public List<QuestionDTO> getFreeSurveyQuestions(Long surveyId) {
        List<Question> questions = questionRepository.findBySurvey_SurveyId(surveyId);
        return questions.stream().map(QuestionDTO::fromEntity).collect(Collectors.toList());
    }

    /**
     * ✅ 유료 문진 (유저가 선택한 주제 기반 질문 & 선택지 조회)
     */
    @Transactional(readOnly = true)
    public List<QuestionDTO> getPaidSurveyQuestions(Long userId) {
        List<UserSelectedTopics> selectedTopics = userSelectedTopicsRepository.findAllByMember_Id(userId);

        if (selectedTopics.isEmpty()) {
            System.out.println("❌ [getPaidSurveyQuestions] 유저가 선택한 주제가 없습니다. userId: " + userId);
            return List.of();
        }

        List<SurveyTopic> topics = selectedTopics.stream()
                .map(UserSelectedTopics::getSurveyTopic)
                .collect(Collectors.toList());

        List<Question> questions = questionRepository.findBySurveyTopicIn(topics);

        if (questions.isEmpty()) {
            System.out.println("❌ [getPaidSurveyQuestions] 선택한 주제에 대한 질문이 없습니다. userId: " + userId);
            return List.of();
        }

        return questions.stream().map(QuestionDTO::fromEntity).collect(Collectors.toList());
    }
}
