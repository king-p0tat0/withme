import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * PaidSurveySelectionPage 컴포넌트
 * - 유료회원(PAID) 문진 검사 주제를 선택하는 페이지
 * - 주제를 선택한 후 문진 검사 페이지로 이동
 */
function PaidSurveySelectionPage() {
  const [topics, setTopics] = useState([]); // 문진 주제 목록 상태
  const [selectedTopics, setSelectedTopics] = useState([]); // 선택된 주제 목록
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 로그인된 사용자 정보 가져오기

  /**
   * ✅ 유료 문진 주제 목록 불러오기
   */
  useEffect(() => {
    axios
      .get(`${API_URL}/api/survey-topics/paid`)
      .then((response) => setTopics(response.data))
      .catch((error) =>
        console.error("문진 주제를 불러오지 못했습니다.", error)
      );
  }, []);

  /**
   * ✅ 주제 선택 변경 처리
   * @param {number} topicId - 선택한 주제 ID
   */
  const handleTopicChange = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId) // 선택 해제
        : [...prev, topicId] // 선택 추가
    );
  };

  /**
   * ✅ 문진 검사 시작 처리
   * - 최소 1개 이상의 주제를 선택해야 문진 시작 가능
   */
  const handleStartSurvey = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (selectedTopics.length === 0) {
      alert("최소 한 개 이상의 주제를 선택해야 합니다.");
      return;
    }

    // 서버에 선택한 주제 저장
    const requestBody = {
      userId: user.id, // Redux에서 가져온 userId 추가
      selectedTopics,
    };

    axios
      .post(`${API_URL}/api/user-selected-topics`, requestBody)
      .then(() => navigate("/survey/paid", { state: { selectedTopics } })) // ✅ 선택한 주제와 함께 페이지 이동
      .catch((error) => console.error("주제 선택 저장 실패:", error));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">유료 문진 검사 주제 선택</h2>
      <p className="mb-2 text-gray-600">문진을 진행할 주제를 선택하세요.</p>

      {/* ✅ 주제 선택 목록 */}
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic) => (
          <label key={topic.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={topic.id}
              checked={selectedTopics.includes(topic.id)}
              onChange={() => handleTopicChange(topic.id)}
            />
            <span>{topic.name}</span>
          </label>
        ))}
      </div>

      {/* ✅ 문진 시작 버튼 */}
      <button
        onClick={handleStartSurvey}
        className="bg-blue-500 text-white px-6 py-3 rounded mt-4 hover:bg-blue-600 transition"
      >
        문진 시작
      </button>
    </div>
  );
}

export default PaidSurveySelectionPage;
