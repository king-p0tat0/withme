import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { Select, MenuItem } from "@mui/material";

function FreeSurveyPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

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
        console.log("✅ 문진 데이터 로드 성공:", data);
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

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("모든 질문에 답변을 선택해야 합니다!");
      return;
    }

    const requestBody = {
      surveyId: 1,
      userId: user?.id,
      answers: Object.entries(answers).map(([questionId, { choiceId, score }]) => ({
        questionId: Number(questionId),
        choiceId,
        score,
      })),
    };

    try {
      const response = await fetchWithAuth(`${API_URL}questionnaires/free`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        const questionnaireId = responseData.questionnaireId;
        console.log("✅ 문진 제출 성공, questionnaire_id:", questionnaireId);
        navigate(`/survey/free/result/${questionnaireId}`);
      } else {
        const errorData = await response.json();
        console.error("❌ 응답 제출 실패", response.status, errorData);
        alert("문진 제출에 실패했습니다: " + (errorData.message || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("❌ 문진 제출 중 오류 발생:", error.message);
      alert("문진 제출 중 오류가 발생했습니다.");
    }
  };

  const columns = [
    { field: "seq", headerName: "번호", flex: 0.5 },
    { field: "questionText", headerName: "질문", flex: 2 },
    {
      field: "choices",
      headerName: "선택지",
      flex: 3,
      renderCell: (params) => (
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          gap: "10px",
          overflow: "hidden",
        }}>
          {params.row.choices.map((choice) => (
            <label
              key={choice.choiceId}
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="radio"
                name={`question-${params.row.id}`}
                value={choice.choiceId}
                onChange={() => handleAnswerChange(params.row.id, choice.choiceId, choice.score)}
                checked={answers[params.row.id]?.choiceId === choice.choiceId}
                style={{
                  marginRight: "5px",
                  transform: "scale(1.1)",
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">무료 문진 검사</h2>

      {/* ✅ DataGrid 테이블 */}
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          loading={loading}
          rowHeight={80}
          paginationMode="client"
          disableColumnMenu
//           pageSizeOptions={[10, 20, 30]}
//           paginationModel={paginationModel}
//           onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        />
      </div>

      {/* ✅ 중앙 정렬된 페이지 정보 */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px",
        padding: "10px",
        fontSize: "1.2rem",
        fontWeight: "bold",
      }}>
        <div>
          Rows per page:
          <Select
            value={paginationModel.pageSize}
            onChange={(event) => setPaginationModel((prev) => ({ ...prev, pageSize: event.target.value }))}
            variant="outlined"
            size="small"
            style={{ marginLeft: "10px", fontSize: "1.2rem" }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </div>
        <div style={{ marginTop: "10px" }}>
          {paginationModel.page * paginationModel.pageSize + 1} -
          {Math.min((paginationModel.page + 1) * paginationModel.pageSize, questions.length)} of {questions.length}
        </div>
      </div>

      {/* ✅ 문진 제출 버튼 */}
      {!loading && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded mt-6 text-lg hover:bg-blue-600 transition"
        >
          제출하기
        </button>
      )}
    </div>
  );
}

export default FreeSurveyPage;
