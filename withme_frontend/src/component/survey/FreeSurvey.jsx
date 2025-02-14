import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import img1 from "../../image/img1.png";

function FreeSurveyPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}questions/free/1`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          // ✅ 프론트엔드에서 질문 중복 제거
          const uniqueQuestions = [];
          const seen = new Set();

          data.forEach((q) => {
            const key = `${q.seq}-${q.questionText}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueQuestions.push({
                id: q.questionId,
                questionText: q.questionText,
                seq: q.seq,
                choices: q.choices,
              });
            }
          });

          setQuestions(uniqueQuestions);
        } else {
          console.error("❌ 문진 데이터를 불러오지 못했습니다.", response.status);
        }
      } catch (error) {
        console.error("❌ 문진 데이터 요청 중 오류 발생:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchQuestions();
    }
  }, [isLoggedIn]);


  const handleAnswerChange = (questionId, choiceId, score) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { choiceId, score },
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("모든 질문에 답변을 선택해야 합니다!");
      return;
    }
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
    navigate("/survey/free/result", { state: { answers, totalScore } });
  };

  const columns = [
    { field: "seq", headerName: "번호", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "questionText", headerName: "질문", flex: 2, headerAlign: "center" },
    {
      field: "choices",
      headerName: "선택지",
      flex: 3,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {params.row.choices.map((choice) => (
            <label key={choice.choiceId} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <input
                type="radio"
                name={`question-${params.row.id}`}
                value={choice.choiceId}
                onChange={() => handleAnswerChange(params.row.id, choice.choiceId, choice.score)}
                checked={answers[params.row.id]?.choiceId === choice.choiceId}
              />
              {choice.choiceText}
            </label>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
        <img src={img1} alt="Survey" style={{ height: "60px" }} />
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#D67D00", backgroundColor: "#FFF3E0", padding: "8px 16px", borderRadius: "8px" }}>무료 문진 검사</h2>
      </div>
      <DataGrid rows={questions} columns={columns} loading={loading} pagination autoHeight />
      <button onClick={handleSubmit} style={{ marginTop: "15px", backgroundColor: "#FF8C00", color: "white", padding: "10px 18px", borderRadius: "8px" }}>🚀 문진 완료 & 결과 보기</button>
    </div>
  );
}

export default FreeSurveyPage;
