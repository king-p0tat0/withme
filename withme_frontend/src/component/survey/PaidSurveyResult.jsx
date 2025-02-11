import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../common/Header"; // ✅ 공통 헤더 추가
import Footer from "../common/Footer"; // ✅ 공통 푸터 추가

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * ✅ 유료 문진 검사 결과 페이지 (PaidSurveyResultPage)
 * - "당신의 애완견의 건강 점수는..." 문구 + 강아지 이미지 표시 🐶
 * - 선택한 주제별 합산 점수를 표로 표시
 * - 방사형 차트(RadarChart)로 시각화
 * - 전문의 문의하기 버튼 추가
 */
function PaidSurveyResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 사용자 정보 가져오기
  const sessionId = location.state?.sessionId || null; // 문진 검사 세션 ID
  const [results, setResults] = useState([]); // 문진 결과 데이터
  const [totalScore, setTotalScore] = useState(0); // 총 점수

  /**
   * ✅ 문진 검사 결과 불러오기
   */
  useEffect(() => {
    if (sessionId && user) {
      axios
        .get(`${API_URL}/api/results/paid/${sessionId}`, {
          params: { userId: user.id },
        })
        .then((response) => {
          setResults(response.data);
          // 총 점수 계산 (각 주제 점수 합산)
          const total = response.data.reduce((sum, item) => sum + item.score, 0);
          setTotalScore(total);
        })
        .catch((error) =>
          console.error("결과 데이터를 불러오지 못했습니다.", error)
        );
    }
  }, [sessionId, user]);

  /**
   * ✅ 전문의 문의하기 버튼 클릭 시 실행
   */
  const handleExpertConsultation = () => {
    navigate("/expert-question", { state: { sessionId } });
  };

  return (
    <>
      <Header /> {/* ✅ 공통 헤더 추가 */}

      <div className="p-6 text-center">
        {/* ✅ 건강 점수 및 강아지 이미지 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600">
            🐶 당신의 애완견의 건강 점수는...
          </h2>
          <img
            src="/dog-health.png" // ✅ 강아지 건강 이미지 (이미지 경로 변경 가능)
            alt="강아지 건강 이미지"
            className="w-32 h-32 mx-auto mt-4"
          />
          <p className="text-3xl font-bold mt-4">🌟 {totalScore} 점 🌟</p>
        </div>

        {/* ✅ 선택한 주제별 합산 점수 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold">주제별 건강 점수</h3>
          <table className="w-full max-w-md mx-auto mt-3 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">주제</th>
                <th className="border p-2">점수</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.category}>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.score}점</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ 방사형 차트 (RadarChart) */}
        <div className="flex justify-center items-center mb-6">
          {results.length > 0 ? (
            <RadarChart cx={300} cy={200} outerRadius={150} width={600} height={400} data={results}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar
                name="점수"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          ) : (
            <p>결과 데이터를 불러오는 중...</p>
          )}
        </div>

        {/* ✅ 전문의 문의하기 버튼 */}
        {sessionId && (
          <button
            onClick={handleExpertConsultation}
            className="bg-red-500 text-white px-6 py-3 rounded mt-6 hover:bg-red-600 transition"
          >
            전문의 문의하기
          </button>
        )}
      </div>

      <Footer /> {/* ✅ 공통 푸터 추가 */}
    </>
  );
}

export default PaidSurveyResultPage;
