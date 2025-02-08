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
 * 설문에 포함된 각 질문에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor  // ✅ 생성자 주입 자동 생성
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
     * ✅ 질문 ID로 질문 조회
     */
    @Transactional(readOnly = true)
    public Optional<Question> getQuestionById(Long questionId) {
        return questionRepository.findById(questionId);
    }

    /**
     * ✅ 특정 userId에 해당하는 유료 문진 질문 리스트 반환
     */
    @Transactional(readOnly = true)
    public List<Question> getQuestionsByUserId(Long userId) {
        // selectedTopics에서 topicId를 추출하고, 이를 기반으로 질문을 찾음
        List<UserSelectedTopics> selectedTopics = userSelectedTopicsRepository.findAllByMember_Id(userId);

        // SurveyTopic 목록을 추출
        List<SurveyTopic> topics = selectedTopics.stream()
                .map(UserSelectedTopics::getSurveyTopic) // SurveyTopic 가져오기
                .collect(Collectors.toList());

        // SurveyTopic 목록을 사용하여 질문 조회
        return questionRepository.findBySurveyTopicIn(topics);
    }


}
