import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * FreeSurveyResultPage 컴포넌트
 * - 무료회원(FREE) 문진 검사 결과를 보여주는 페이지
 * - 원형 그래프(Pie Chart)로 시각화
 * - 유료회원 전환 버튼 추가
 */
function FreeSurveyResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // ✅ Redux에서 사용자 정보 가져오기
  const answers = location.state?.answers || {}; // ✅ 응답 점수 데이터
  const totalScore = location.state?.totalScore || 0; // ✅ 총점 데이터
  const [chartData, setChartData] = useState([]);

  /**
   * ✅ 응답 데이터를 원형 그래프(Pie Chart) 형식으로 변환
   */
  useEffect(() => {
    if (answers) {
      const formattedData = Object.keys(answers).map((qId) => ({
        name: `Q${qId}`,
        value: answers[qId],
      }));
      setChartData(formattedData);
    }
  }, [answers]);

  /**
   * ✅ 유료회원 전환 버튼 클릭 시 실행
   */
  const handleUpgradeToPaid = () => {
    alert("유료회원 전환 페이지로 이동합니다!");
    navigate("/membership"); // ✅ 유료회원 전환 페이지로 이동
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">무료 문진 검사 결과</h2>

      {/* ✅ 사용자 정보 표시 */}
      {user && <p className="text-lg text-gray-600">사용자: {user.name}</p>}

      {/* ✅ 총점 표시 */}
      <p className="text-lg font-semibold mb-4">
        총점: {totalScore} / {Object.keys(answers).length * 5}
      </p>

      {/* ✅ 원형 그래프 (Pie Chart) */}
      {chartData.length > 0 ? (
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={[
                  "#0088FE",
                  "#00C49F",
                  "#FFBB28",
                  "#FF8042",
                  "#A28AEF",
                ][index % 5]} // ✅ 색상 자동 순환 적용
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>결과 데이터를 불러오는 중...</p>
      )}

      {/* ✅ 유료회원 전환 버튼 */}
      <button
        onClick={handleUpgradeToPaid}
        className="bg-red-500 text-white px-6 py-3 rounded mt-6 hover:bg-red-600 transition"
      >
        유료회원 전환하기
      </button>
    </div>
  );
}

export default FreeSurveyResultPage;
