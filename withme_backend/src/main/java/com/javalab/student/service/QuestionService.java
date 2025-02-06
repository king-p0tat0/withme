package com.javalab.student.service;

import com.javalab.student.entity.Question;
import com.javalab.student.entity.SurveyTopic;
import com.javalab.student.entity.UserSelectedTopics;
import com.javalab.student.repository.QuestionRepository;
import com.javalab.student.repository.UserSelectedTopicsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 📌 질문 서비스
 * 설문에 포함된 각 질문에 대한 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserSelectedTopicsRepository userSelectedTopicsRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, UserSelectedTopicsRepository userSelectedTopicsRepository) {
        this.questionRepository = questionRepository;
        this.userSelectedTopicsRepository = userSelectedTopicsRepository;
    }

    /**
     * ✅ 모든 질문 조회
     */
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     * ✅ 질문 ID로 질문 조회
     */
    public Optional<Question> getQuestionById(Long questionId) {
        return questionRepository.findById(questionId);
    }

    /**
     * ✅ 특정 userId에 해당하는 유료 문진 질문 리스트 반환
     */
    public List<Question> getQuestionsByUserId(Long userId) {
        // ✅ 복합 키를 사용한 엔티티이므로 `findAllByMember_UserId`로 변경
        List<UserSelectedTopics> selectedTopics = userSelectedTopicsRepository.findAllByMember_UserId(userId);

        // ✅ selectedTopics에서 topicId를 추출하고, 이를 기반으로 질문을 찾음
        return selectedTopics.stream()
                .map(UserSelectedTopics::getSurveyTopic)  // SurveyTopic 가져오기
                .map(SurveyTopic::getTopicId) // topicId 가져오기
                .flatMap(topicId -> questionRepository.findBySurveyTopic_TopicId(topicId).stream()) // topicId 기반 질문 조회
                .collect(Collectors.toList());
    }
}
