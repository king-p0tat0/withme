import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import img1 from "../../image/img1.png"; // 투명 배경 이미지

function FreeSurveyPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("문진을 진행하려면 로그인이 필요합니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}questions/free/1`, { method: "GET" });

      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((q) => ({
          id: q.questionId,
          questionText: q.questionText,
          seq: q.seq,
          choices: q.choices,
        }));
        setQuestions(formattedData);
      } else {
        console.error("❌ 문진 데이터를 불러오지 못했습니다.", response.status);
      }
    } catch (error) {
      console.error("❌ 문진 데이터 요청 중 오류 발생:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
          padding: "3px"
        }}>
          {params.row.choices.map((choice) => (
            <label key={choice.choiceId} style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              whiteSpace: "nowrap",
              fontSize: "1.1rem",
            }}>
              <input
                type="radio"
                name={`question-${params.row.id}`}
                value={choice.choiceId}
                onChange={() => handleAnswerChange(params.row.id, choice.choiceId, choice.score)}
                checked={answers[params.row.id]?.choiceId === choice.choiceId}
                style={{
                  transform: "scale(1.1)",
                  marginRight: "3px",
                }}
              />
              {choice.choiceText}
            </label>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ textAlign: "center" }}>
      {/* ✅ 이미지와 제목을 가로로 나열 */}
      <div style={{
        display: "flex",
        flexDirection: "row", // ✅ 가로 정렬
        alignItems: "center",
        justifyContent: "center",
        gap: "10px", // ✅ 이미지와 텍스트 간 간격
        marginBottom: "10px"
      }}>
        <img src={img1} alt="Survey" style={{ height: "60px" }} /> {/* 이미지 */}
        <h2 style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#D67D00",
          backgroundColor: "#FFF3E0",
          padding: "8px 16px",
          borderRadius: "8px",
        }}>
          무료 문진 검사
        </h2> {/* 제목 */}
      </div>

      <div style={{ height: 600, width: "100%", marginTop: "10px" }}>
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          loading={loading}
          rowHeight={70}
          pagination
          pageSizeOptions={[5, 10, 15]}
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          sx={{
            "& .MuiDataGrid-footerContainer": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFF3E0",
              padding: "8px 0",
            },
            "& .MuiTablePagination-root": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#D67D00",
            },
            "& .MuiTablePagination-toolbar": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiTablePagination-actions": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }
          }}
        />
      </div>

      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 0",
        fontSize: "1.1rem",
        fontWeight: "bold",
        color: "#D67D00",
        backgroundColor: "#FFF3E0",
        borderRadius: "8px",
        marginTop: "10px"
      }}>
        <span style={{ marginRight: "10px" }}>📋 Rows per page: {paginationModel.pageSize}</span>
        <span>
          {paginationModel.page * paginationModel.pageSize + 1} - {Math.min((paginationModel.page + 1) * paginationModel.pageSize, questions.length)} of {questions.length}
        </span>
      </Box>

      {!loading && (
        <button
          onClick={handleSubmit}
          style={{
            width: "60%",
            backgroundColor: "#FF8C00",
            color: "white",
            padding: "10px 18px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            marginTop: "15px"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1.0)"}
        >
          🚀 문진 완료 & 결과 보기
        </button>
      )}
    </div>
  );
}

export default FreeSurveyPage;
