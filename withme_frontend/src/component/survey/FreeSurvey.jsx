import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../common/Header"; // ✅ 공통 헤더 추가
import Footer from "../common/Footer"; // ✅ 공통 푸터 추가

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * 📌 FreeSurveyPage 컴포넌트 (무료 문진)
 * - 로그인한 사용자만 문진 가능하도록 설정
 * - 질문 목록을 API에서 가져와 표시
 * - 응답 제출 시 userId 포함하여 저장
 */
function FreeSurveyPage() {
  const [questions, setQuestions] = useState([]); // 문진 질문 목록
  const [answers, setAnswers] = useState({}); // 사용자의 선택한 답변
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 로그인한 사용자 정보 가져오기
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 여부 체크

  /** 🚨 로그인 체크 (비로그인 사용자는 로그인 페이지로 이동) */
  useEffect(() => {
    if (!isLoggedIn) {
      alert("문진을 진행하려면 로그인이 필요합니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  /** ✅ 문진 질문 목록 가져오기 */
  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/questions/free/1`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 로그인 세션 유지
        })
        .then((response) => {
          console.log("✅ 문진 데이터 로드 성공:", response.data);
          setQuestions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("❌ 문진 데이터를 불러오지 못했습니다.", error);
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  /** ✅ 사용자의 답변을 저장하는 함수 */
  const handleAnswerChange = (questionId, choiceId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  /** ✅ 문진 검사 제출 */
  const handleSubmit = () => {
    if (!user) {
      alert("문진을 제출하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const requestBody = {
      userId: user.id, // ✅ 로그인된 사용자 ID 포함
      answers,
    };

    axios
      .post(`${API_URL}/api/responses/free`, requestBody, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        console.log("✅ 문진 제출 성공");
        navigate("/survey/free/result", { state: { answers } }); // ✅ 결과 페이지로 이동
      })
      .catch((error) => {
        console.error("❌ 응답 제출 실패:", error);
      });
  };

  return (
    <>
      <Header /> {/* ✅ 공통 헤더 추가 */}

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">무료 문진 검사</h2>

        {/* 로딩 표시 */}
        {loading && <p className="text-center">문진 데이터를 불러오는 중...</p>}

        {/* 문진 질문 목록 */}
        {!loading &&
          questions.map((q) => (
            <div key={q.question_id} className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
              <p className="font-semibold mb-2">{q.question_text}</p>
              <div className="flex space-x-4">
                {q.choices?.map((choice) => (
                  <label key={choice.choice_id} className="flex items-center cursor-pointer space-x-2">
                    <input
                      type="radio"
                      name={`question-${q.question_id}`}
                      value={choice.choice_id}
                      onChange={() => handleAnswerChange(q.question_id, choice.choice_id)}
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-md text-white transition ${
                        answers[q.question_id] === choice.choice_id
                          ? "bg-blue-500"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    >
                      {choice.choice_text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

        {/* 제출 버튼 */}
        {!loading && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded mt-6 text-lg hover:bg-blue-600 transition"
          >
            제출하기
          </button>
        )}
      </div>

      <Footer /> {/* ✅ 공통 푸터 추가 */}
    </>
  );
}

export default FreeSurveyPage;
