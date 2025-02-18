import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import img2 from "../../image/img2.png";

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
      <div style={{ borderBottom: "3px solid pink", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
        <img src={img2} alt="img2" style={{ height: "60px", marginRight: "10px" }} />
        <span style={{ color: "#000", fontSize: "2rem", marginRight: "10px" }}>무료 문진 검사</span>
      </div>
      <DataGrid rows={questions} columns={columns} loading={loading} autoHeight hideFooterPagination />
      <button onClick={handleSubmit} style={{ marginTop: "15px", backgroundColor: "#FFB6C1", color: "#000", padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
        🐾 문진 완료 & 결과 보기
      </button>
    </div>
  );
}

export default FreeSurveyPage;