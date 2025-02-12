import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../common/Header"; // ✅ 공통 헤더 추가
import Footer from "../common/Footer"; // ✅ 공통 푸터 추가

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * ✅ 유료회원 문진 검사 페이지
 * - 사용자가 선택한 주제에 따라 질문을 표시하고, 5지선다형 응답을 저장
 * - 이전/다음 버튼을 이용한 이동 기능 추가
 * - 진행 상태바(Progress Bar) 추가
 * - 마지막 질문에서는 "제출하기" 버튼 표시
 */
function PaidSurveyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 로그인된 사용자 정보 가져오기
  const selectedTopics = location.state?.selectedTopics || []; // ✅ 선택한 주제 목록
  const [questions, setQuestions] = useState([]); // 문진 질문 목록 상태
  const [answers, setAnswers] = useState({}); // 사용자 응답 상태
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 질문 인덱스

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
   * ✅ 다음 질문으로 이동
   */
  const handleNext = () => {
    if (!answers[questions[currentIndex].id]) {
      alert("응답을 선택해주세요.");
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  /**
   * ✅ 이전 질문으로 이동
   */
  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  /**
   * ✅ 문진 검사 제출 처리
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
    <>
      <Header /> {/* ✅ 공통 헤더 추가 */}

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">유료 문진 검사</h2>

        {/* ✅ 진행 상태바 (Progress Bar) */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* ✅ 선택한 주제 표시 */}
        <p className="mb-4 text-gray-600">
          선택한 주제:{" "}
          {selectedTopics.length > 0
            ? selectedTopics.join(", ")
            : "주제가 선택되지 않았습니다."}
        </p>

        {/* ✅ 현재 질문 표시 */}
        {questions.length > 0 ? (
          <div key={questions[currentIndex].id} className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="font-semibold">{questions[currentIndex].text}</p>
            <div className="flex space-x-2 mt-3">
              {[5, 4, 3, 2, 1].map((score) => (
                <label key={score} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${questions[currentIndex].id}`}
                    value={score}
                    onChange={() => handleAnswerChange(questions[currentIndex].id, score)}
                    className="hidden"
                  />
                  <span
                    className={`px-4 py-2 rounded-md text-white transition ${
                      answers[questions[currentIndex].id] === score
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
        ) : (
          <p>문진 질문을 불러오는 중...</p>
        )}

        {/* ✅ 이전, 다음 버튼 및 제출 버튼 */}
        <div className="flex justify-between mt-6">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrev}
            className={`bg-gray-500 text-white px-6 py-3 rounded ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
            }`}
            disabled={currentIndex === 0}
          >
            이전
          </button>

          {/* 다음 버튼 또는 제출 버튼 */}
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            >
              제출하기
            </button>
          )}
        </div>
      </div>

      <Footer /> {/* ✅ 공통 푸터 추가 */}
    </>
  );
}

export default PaidSurveyPage;
