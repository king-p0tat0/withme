import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * FreeSurveyPage 컴포넌트
 * - 무료회원(FREE) 문진 검사를 진행하는 페이지
 * - 질문 목록을 API에서 가져오고, 사용자가 응답한 데이터를 저장하여 서버에 제출
 * - 로그인된 사용자의 `userId`를 Redux에서 가져와 사용
 */
function FreeSurveyPage() {
  const [questions, setQuestions] = useState([]); // 문진 질문 상태
  const [answers, setAnswers] = useState({}); // 사용자 답변 상태
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 사용자 정보 가져오기

  /**
   * 📌 무료 문진 질문 목록 가져오기
   * - API에서 무료 문진 질문 목록을 가져와 상태에 저장
   */
  useEffect(() => {
    axios
      .get(`${API_URL}/api/questions/free/1`) // 무료 문진 (surveyId = 1)
      .then((response) => setQuestions(response.data))
      .catch((error) =>
        console.error("문진 데이터를 불러오지 못했습니다.", error)
      );
  }, []);

  /**
   * 📌 사용자의 답변을 저장하는 함수
   * @param {number} questionId - 문진 질문 ID
   * @param {number} score - 사용자가 선택한 점수
   */
  const handleAnswerChange = (questionId, score) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  /**
   * 📌 문진 검사 제출 처리
   * - 로그인 여부 확인 후, 응답을 서버로 전송하고 결과 페이지로 이동
   */
  const handleSubmit = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    ); // ✅ 총점 계산

    const requestBody = {
      userId: user.id, // Redux에서 가져온 사용자 ID 추가
      answers,
    };

    axios
      .post(`${API_URL}/api/responses/free`, requestBody)
      .then(() =>
        navigate("/survey/free/result", { state: { answers, totalScore } })
      ) // ✅ 결과 페이지로 이동
      .catch((error) => console.error("응답 제출 실패:", error));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">무료 문진 검사</h2>

      {questions.map((q) => (
        <div key={q.id} className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
          <p className="font-semibold mb-2">{q.text}</p>
          <div className="flex space-x-4">
            {[5, 4, 3, 2, 1].map((score) => (
              <label
                key={score}
                className="flex items-center cursor-pointer space-x-2"
              >
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
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded mt-6 text-lg hover:bg-blue-600 transition"
      >
        제출하기
      </button>
    </div>
  );
}

export default FreeSurveyPage;
