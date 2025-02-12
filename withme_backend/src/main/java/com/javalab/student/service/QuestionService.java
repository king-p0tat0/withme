package com.javalab.student.service;

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
 * 📌 질문 서비스
 * - 설문 질문을 가져오는 서비스 로직
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
     * ✅ 특정 설문 ID의 질문 조회 (무료 문진)
     */
    @Transactional(readOnly = true)
    public List<Question> getQuestionsBySurveyId(Long surveyId) {
        return questionRepository.findBySurvey_SurveyId(surveyId);
    }

    /**
     * ✅ 특정 유저 ID의 질문 조회 (유료 문진)
     */
    @Transactional(readOnly = true)
    public List<Question> getQuestionsByUserId(Long userId) {
        List<UserSelectedTopics> selectedTopics = userSelectedTopicsRepository.findAllByMemberUserId(userId);
        List<SurveyTopic> topics = selectedTopics.stream()
                .map(UserSelectedTopics::getSurveyTopic)
                .collect(Collectors.toList());

        return questionRepository.findBySurveyTopicIn(topics);
    }
}
