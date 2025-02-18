import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function FreeSurveyResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || { answers: {} };

  const totalQuestions = 15;
  const maxScore = 75;
  const totalScore = Math.round((Object.values(answers).reduce((sum, answer) => sum + answer.score, 0) / (totalQuestions * 5)) * maxScore);

  const chartData = [
    { name: "문진 결과 점수", value: totalScore, color: "#FF4C4C" },
    { name: "남은 점수", value: maxScore - totalScore, color: "#FFD700" },
  ];

  const getMessage = (score) => {
    if (score <= 15) return "⚠️ 반려동물 건강이 위험할 수 있어요! 지금부터 건강 관리에 더 신경 써주세요.";
    if (score <= 45) return "🐾 반려동물의 건강을 위해 더 많은 관심과 노력이 필요해요!";
    if (score <= 60) return "🌟 훌륭하지만, 최상의 건강을 위해 더 노력해보세요!";
    return "🏆 완벽한 건강 관리 중! 당신의 반려동물은 최고로 케어 받고 있어요!";
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      padding: "30px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFF8E1"
    }}>
      <h2 style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "30px",
        color: "#333",
        backgroundColor: "#FFE0B2",
        padding: "15px 25px",
        borderRadius: "15px",
      }}>
        🐾 무료 문진 검사 결과 🐾
      </h2>

      <p style={{
        fontSize: "1.6rem",
        fontWeight: "bold",
        marginBottom: "30px",
        padding: "15px 25px",
        borderRadius: "12px",
        backgroundColor: totalScore <= 30 ? "#FFEBEE" : totalScore <= 60 ? "#FFF8E1" : "#E8F5E9",
        color: totalScore <= 30 ? "#D32F2F" : totalScore <= 60 ? "#F57C00" : "#388E3C",
        textAlign: "center",
        maxWidth: "80%"
      }}>
        {getMessage(totalScore)}
      </p>

      <p style={{
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#444"
      }}>
        총점: {totalScore}점 / {maxScore}점
      </p>

      <div style={{ marginBottom: "40px" }}>
        <PieChart width={500} height={500}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={150}
            innerRadius={90}
            fill="#82ca9d"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}점`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <button
        onClick={() => navigate("/login")}
        style={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          padding: "15px 30px",
          color: "#fff",
          backgroundColor: "#FF8C00",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out"
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1.0)"}
      >
        🐾 회원가입하러 가기~
      </button>
    </div>
  );
}

export default FreeSurveyResultPage;
