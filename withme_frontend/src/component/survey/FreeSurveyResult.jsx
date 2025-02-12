import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import Header from "../common/Header";
import Footer from "../common/Footer";

/**
 * 📌 무료 문진 결과 페이지 (Questionnaire 기반)
 * - 백엔드의 `/api/questionnaires/user/{userId}` API에서 최신 문진 결과를 가져옴
 * - 원형 그래프(Pie Chart)로 시각화
 */
function FreeSurveyResultPage() {
  const { userId } = useParams(); // ✅ URL에서 userId 가져오기
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // ✅ Redux에서 로그인된 사용자 정보 가져오기
  const [totalScore, setTotalScore] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  /** ✅ 무료 문진 결과 불러오기 (Questionnaire 기반) */
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchSurveyResults = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL + "questionnaires/user/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ 필요 시 인증 토큰 추가
          },
        });

        if (!response.ok) {
          console.error("❌ 문진 결과 데이터를 불러오지 못했습니다.", response.status);
          return;
        }

        const data = await response.json();
        console.log("✅ 문진 결과 데이터 로드 성공:", data);

        if (!data || data.length === 0) {
          alert("무료 문진 기록이 없습니다.");
          navigate("/survey/free");
          return;
        }

        // ✅ 최신 문진 결과 가져오기
        const latestResult = data[data.length - 1];

        // ✅ 총점과 차트 데이터 설정
        setTotalScore(latestResult.score);
        setChartData([
          { name: "문진 결과 점수", value: latestResult.score },
          { name: "최대 점수", value: data.length * 5 - latestResult.score },
        ]);
      } catch (error) {
        console.error("❌ 문진 결과 요청 중 오류 발생:", error.message);
      } finally {
        setLoading(false);
      }
    };


    fetchSurveyResults();
  }, [userId, navigate, user]);

  /** ✅ 유료회원 전환 버튼 클릭 시 실행 */
  const handleUpgradeToPaid = () => {
    alert("회원가입 페이지로 이동합니다!");
    navigate("/registerMember");
  };

  return (
    <>
      <Header /> {/* ✅ 공통 헤더 추가 */}

      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">무료 문진 검사 결과</h2>

        {/* ✅ 사용자 정보 표시 */}
        {user && <p className="text-lg text-gray-600">사용자: {user.name}</p>}

        {/* ✅ 총점 표시 */}
        {loading ? (
          <p>결과 데이터를 불러오는 중...</p>
        ) : (
          <>
            <p className="text-lg font-semibold mb-4">
              총점: {totalScore} / {15 * 5} {/* ✅ 총점 계산 */}
            </p>

            {/* ✅ 원형 그래프 (Pie Chart) */}
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
                    fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AEF"][index % 5]} // ✅ 색상 자동 순환 적용
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            {/* ✅ 유료회원 전환 버튼 (회원가입 페이지로 이동) */}
            <button
              onClick={handleUpgradeToPaid}
              className="bg-red-500 text-white px-6 py-3 rounded mt-6 hover:bg-red-600 transition"
            >
              유료회원 전환하기
            </button>
          </>
        )}
      </div>

      <Footer /> {/* ✅ 공통 푸터 추가 */}
    </>
  );
}

export default FreeSurveyResultPage;
