import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { Paper, Button } from "@mui/material";

const PaidSurveyResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topicScores } = location.state || { topicScores: [] };

  if (topicScores.length === 0) {
    return (
      <Paper elevation={3} className="p-8 m-4 text-center">
        <h2 className="text-xl mb-4">결과를 찾을 수 없습니다</h2>
        <Button variant="contained" onClick={() => navigate("/survey/paid/selection")}>
          문진 시작하기
        </Button>
      </Paper>
    );
  }

  const totalPerTopic = 75; // 각 주제별 최대 점수 (예: 15문항 * 5점)
  const data = topicScores.map(({ topic, score }) => ({
    name: `${topic} : ${score} / ${totalPerTopic}점`,
    score,
    fill: "#FF8C00"
  }));

  const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    lineHeight: '24px',
    fontSize: '1.1rem',
    color: '#D67D00'
  };

  return (
    <Paper elevation={3} className="p-8 m-4" style={{ textAlign: "center" }}>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#D67D00",
        backgroundColor: "#FFF3E0",
        padding: "10px 20px",
        borderRadius: "10px",
        display: "inline-block",
        marginBottom: "30px"
      }}>
        🐶 유료 문진 검사 결과 🐾
      </h1>

      {/* ✅ 주제별 점수 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
        marginBottom: "40px"
      }}>
        {topicScores.map(({ topic, score }) => (
          <div key={topic} style={{
            backgroundColor: "#FFF3E0",
            color: "#D67D00",
            fontSize: "1.4rem",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "10px",
            width: "80%",
            textAlign: "center"
          }}>
            {topic} : {score} / {totalPerTopic}점
          </div>
        ))}
      </div>

      {/* ✅ RadialBarChart 그래프 */}
      <div className="flex justify-center mb-8">
        <RadialBarChart
          width={600}
          height={500}
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={20}
          data={data}
        >
          <RadialBar minAngle={15} background clockWise dataKey="score" />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
          <Tooltip />
        </RadialBarChart>
      </div>

      <div className="text-center">
        <Button variant="contained" color="primary" onClick={() => navigate("/expert-consultation")} sx={{ marginRight: "10px" }}>
          전문의 상담 예약
        </Button>
        <Button variant="outlined" onClick={() => navigate("/survey/history")}>
          검사 이력 보기
        </Button>
      </div>
    </Paper>
  );
};

export default PaidSurveyResultPage;
