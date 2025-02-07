import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * SurveyResultPage 컴포넌트
 * - 유료회원(PAID) 문진 검사 결과를 방사형 차트(RadarChart)로 시각화
 * - 사용자가 응답한 점수 데이터를 시각적으로 보여줌
 * - 전문의 문의 기능 추가
 */
function SurveyResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux에서 사용자 정보 가져오기
  const sessionId = location.state?.sessionId || null; // 문진 검사 세션 ID
  const [results, setResults] = useState([]);

  /**
   * ✅ 문진 검사 결과 불러오기
   */
  useEffect(() => {
    if (sessionId && user) {
      axios
        .get(`${API_URL}/api/results/paid/${sessionId}`, {
          params: { userId: user.id }, // ✅ 요청 시 userId 추가
        })
        .then((response) => setResults(response.data))
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
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">유료 문진 검사 결과</h2>

      {/* ✅ 사용자 정보 표시 */}
      {user && <p className="text-lg text-gray-600">사용자: {user.name}</p>}

      {/* ✅ 방사형 차트 (RadarChart) */}
      {results.length > 0 ? (
        <RadarChart
          cx={300}
          cy={200}
          outerRadius={150}
          width={600}
          height={400}
          data={results}
        >
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
  );
}

export default SurveyResultPage;
