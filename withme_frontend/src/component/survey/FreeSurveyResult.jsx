import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth";

function FreeSurveyResultPage() {
  const { questionnaireId } = useParams(); // ✅ URL에서 questionnaireId 가져오기
  const navigate = useNavigate();
  const [totalScore, setTotalScore] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(`${API_URL}api/questionnaires/${questionnaireId}`, { method: "GET" });

        if (!response.ok) {
          console.error("❌ 문진 결과 데이터를 불러오지 못했습니다.", response.status);
          return;
        }

        const data = await response.json();
        setTotalScore(data.score);
        setChartData([
          { name: "문진 결과 점수", value: data.score },
          { name: "최대 점수", value: 15 * 5 - data.score },
        ]);
      } catch (error) {
        console.error("❌ 문진 결과 요청 중 오류 발생:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResults();
  }, [questionnaireId]);

  return (
    <div>
      <h2>무료 문진 검사 결과</h2>
      {loading ? <p>로딩 중...</p> : (
        <>
          <p>총점: {totalScore} / {15 * 5}</p>
          <PieChart width={400} height={300}>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F"][index % 2]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      )}
    </div>
  );
}

export default FreeSurveyResultPage;
