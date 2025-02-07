import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * PaidSurveyPage 컴포넌트
 * - 유료회원(PAID) 문진 검사를 진행하는 페이지
 * - 선택한 주제에 따라 필터링된 질문을 API에서 가져와 표시
 * - 응답을 서버에 저장한 후 결과 페이지로 이동
 */
function PaidSurveyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 로그인된 사용자 정보 가져오기
  const selectedTopics = location.state?.selectedTopics || []; // ✅ 선택한 주제 목록
  const [questions, setQuestions] = useState([]); // 문진 질문 목록 상태
  const [answers, setAnswers] = useState({}); // 사용자 응답 상태

  /**
   * ✅ 선택한 주제별 질문 불러오기
   */
  useEffect(() => {
    if (selectedTopics.length > 0) {
      axios
        .get(`${API_URL}/api/questions/paid`, {
          params: { topics: selectedTopics.join(",") }, // ✅ 주제 ID 리스트를 query params로 전달
        })
        .then((response) => setQuestions(response.data))
        .catch((error) =>
          console.error("질문 데이터를 불러오지 못했습니다.", error)
        );
    }
  }, [selectedTopics]);

  /**
   * ✅ 사용자의 응답을 저장하는 함수
   * @param {number} questionId - 질문 ID
   * @param {number} score - 사용자가 선택한 점수
   */
  const handleAnswerChange = (questionId, score) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  /**
   * ✅ 문진 검사 제출 처리
   * - 로그인 확인 후 응답을 서버로 전송
   */
  const handleSubmit = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const requestBody = {
      userId: user.id, // ✅ Redux에서 가져온 사용자 ID 포함
      answers,
    };

    axios
      .post(`${API_URL}/api/responses/paid`, requestBody)
      .then(() =>
        navigate("/survey/paid/result", { state: { answers } })
      ) // ✅ 결과 페이지로 이동
      .catch((error) => console.error("응답 제출 실패:", error));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">유료 문진 검사</h2>

      {/* ✅ 선택한 주제 표시 */}
      <p className="mb-4 text-gray-600">
        선택한 주제:{" "}
        {selectedTopics.length > 0
          ? selectedTopics.join(", ")
          : "주제가 선택되지 않았습니다."}
      </p>

      {/* ✅ 문진 질문 표시 */}
      {questions.length > 0 ? (
        questions.map((q) => (
          <div key={q.id} className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="font-semibold">{q.text}</p>
            <div className="flex space-x-2">
              {[5, 4, 3, 2, 1].map((score) => (
                <label key={score} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={score}
                    onChange={() => handleAnswerChange(q.id, score)}
                    className="hidden"
                  />
                  <span
                    className={`px-4 py-2 rounded-md text-white transition ${
                      answers[q.id] === score
                        ? "bg-blue-500"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {score}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>문진 질문을 불러오는 중...</p>
      )}

      {/* ✅ 문진 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded mt-6 text-lg hover:bg-blue-600 transition"
      >
        제출하기
      </button>
    </div>
  );
}

export default PaidSurveyPage;
