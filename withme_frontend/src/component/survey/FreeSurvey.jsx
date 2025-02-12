import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

function FreeSurveyPage() {
  const [questions, setQuestions] = useState([]); // 질문 목록
  const [answers, setAnswers] = useState({}); // 선택한 답변 저장
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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
          id: q.questionId, // DataGrid에서 사용될 고유 ID
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

  /** ✅ 선택지 변경 핸들러 */
  const handleAnswerChange = (questionId, choiceId, score) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { choiceId, score },
    }));
  };

  /** ✅ 문진 제출 핸들러 */
  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("모든 질문에 답변을 선택해야 합니다!");
      return;
    }

    const requestBody = {
      answers: Object.entries(answers).map(([questionId, { choiceId, score }]) => ({
        questionId: Number(questionId),
        choiceId,
        score,
      })),
    };

    try {
      const response = await fetchWithAuth(`${API_URL}quesions/free/1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("✅ 문진 제출 성공");
        navigate("/survey/free/result", { state: { answers } });
      } else {
        // 에러 응답의 세부 내용을 확인하면 좋습니다
        const errorData = await response.json();
        console.error("❌ 응답 제출 실패", response.status, errorData);
        alert("문진 제출에 실패했습니다: " + (errorData.message || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("❌ 문진 제출 중 오류 발생:", error.message);
      alert("문진 제출 중 오류가 발생했습니다.");
    }
  };

  /** ✅ DataGrid 컬럼 정의 */
  const columns = [
    { field: "seq", headerName: "번호", flex: 1 },
    { field: "questionText", headerName: "질문", flex: 3 },
    {
      field: "choices",
      headerName: "선택지",
      flex: 3,
      renderCell: (params) => (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "5px",
          flexWrap: "wrap", // ✅ 선택지가 한 칸에 모두 들어가도록 설정
          maxHeight: "150px", // ✅ 셀의 최대 높이 제한
          overflow: "auto", // ✅ 선택지가 많으면 스크롤 가능
          whiteSpace: "nowrap" // ✅ 줄 바꿈 방지
        }}>
          {params.row.choices.map((choice) => (
            <label key={choice.choiceId} style={{ display: "block", whiteSpace: "nowrap" }}>
              <input
                type="radio"
                name={`question-${params.row.id}`}
                value={choice.choiceId}
                onChange={() => handleAnswerChange(params.row.id, choice.choiceId, choice.score)}
                checked={answers[params.row.id]?.choiceId === choice.choiceId}
                style={{ marginRight: "8px" }}
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

      {/* DataGrid */}
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          loading={loading}
          rowHeight={100} // ✅ 행 높이 증가
          pageSizeOptions={[10, 20, 30]} // ✅ 페이지 옵션 추가
          paginationModel={paginationModel} // ✅ 페이지네이션 적용
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        />
      </div>

      {/* 제출 버튼 */}
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
