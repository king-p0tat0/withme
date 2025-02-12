import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid"; // ✅ MUI DataGrid 컴포넌트 사용
import { Button } from "@mui/material";

function FreeSurveyPage() {
  // ✅ 문진 질문 목록을 저장하는 state
  const [questions, setQuestions] = useState([]);

  // ✅ 사용자가 선택한 답변을 저장하는 state
  const [answers, setAnswers] = useState({});

  // ✅ 데이터 로딩 상태를 관리하는 state
  const [loading, setLoading] = useState(true);

  // ✅ DataGrid 페이지네이션(현재 페이지 및 페이지 크기) 설정
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // ✅ 페이지 이동을 위한 React Router Hook
  const navigate = useNavigate();

  // ✅ Redux 상태에서 로그인 여부 가져오기
  const { user, isLoggedIn } = useSelector((state) => state.auth); // ✅ 사용자 정보 추가

  // ✅ 사용자가 로그인하지 않았을 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!isLoggedIn) {
      alert("문진을 진행하려면 로그인이 필요합니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  /**
   * ✅ 문진 질문 목록을 가져오는 함수
   * - API 호출하여 `questions/free/1` 경로에서 무료 문진 질문을 가져옴
   * - 각 질문에 연결된 선택지(choices) 데이터도 함께 설정
   */
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}questions/free/1`, { method: "GET" });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ 문진 데이터 로드 성공:", data);

        // ✅ DataGrid에서 사용할 형식으로 변환
        const formattedData = data.map((q) => ({
          id: q.questionId, // ✅ DataGrid에서 고유 ID로 사용할 값
          questionText: q.questionText, // ✅ 질문 내용
          seq: q.seq, // ✅ 문항 순서
          choices: q.choices, // ✅ 해당 질문에 연결된 선택지 목록
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

  // ✅ 컴포넌트가 마운트되면 문진 질문 목록을 가져옴
  useEffect(() => {
    if (isLoggedIn) {
      fetchQuestions();
    }
  }, [isLoggedIn]);

  /**
   * ✅ 선택한 답변을 state에 저장하는 함수
   * - 사용자가 특정 질문의 선택지를 선택하면 `answers` state를 업데이트함
   */
  const handleAnswerChange = (questionId, choiceId, score) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { choiceId, score },
    }));
  };

  /**
   * ✅ 문진 제출 함수
   * - 사용자가 모든 질문에 답변을 완료했는지 검증 후 제출
   * - `POST /api/questionnaires/free` 엔드포인트로 데이터를 전송
   */
  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("모든 질문에 답변을 선택해야 합니다!");
      return;
    }

    const requestBody = {
      surveyId: 1, // ✅ 무료 문진 ID
      userId: user?.id, // ✅ 로그인한 사용자 ID
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
        const questionnaireId = responseData.questionnaireId; // ✅ 백엔드에서 받은 questionnaire_id

        console.log("✅ 문진 제출 성공, questionnaire_id:", questionnaireId);
        navigate(`/survey/free/result/${questionnaireId}`); // ✅ 결과 페이지로 이동
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

  /**
   * ✅ DataGrid 컬럼 설정
   * - `seq` : 질문 번호
   * - `questionText` : 질문 내용
   * - `choices` : 해당 질문의 선택지 목록
   */
  const columns = [
    { field: "seq", headerName: "번호", flex: 1 }, // ✅ 질문 번호
    { field: "questionText", headerName: "질문", flex: 3 }, // ✅ 질문 내용
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
          flexWrap: "wrap", // ✅ 선택지가 여러 개일 경우 자동 줄바꿈
          maxHeight: "150px", // ✅ 셀의 최대 높이 제한
          overflow: "auto", // ✅ 선택지가 많으면 스크롤 허용
          whiteSpace: "nowrap" // ✅ 선택지 줄 바꿈 방지
        }}>
          {params.row.choices.map((choice) => (
            <label key={choice.choiceId} style={{ display: "block", whiteSpace: "nowrap" }}>
              <input
                type="radio"
                name={`question-${params.row.id}`} // ✅ 각 질문마다 고유한 name 설정
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

      {/* ✅ DataGrid 테이블 */}
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={questions} // ✅ 문진 질문 데이터
          columns={columns} // ✅ 컬럼 설정
          getRowId={(row) => row.id} // ✅ 각 행의 고유 ID 설정
          disableRowSelectionOnClick // ✅ 행 클릭 시 선택되지 않도록 설정
          loading={loading} // ✅ 로딩 상태 적용
          rowHeight={150} // ✅ 행 높이 증가
          pageSizeOptions={[10, 20, 30]} // ✅ 페이지 크기 옵션 추가
          paginationModel={paginationModel} // ✅ 페이지네이션 모델 설정
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)} // ✅ 페이지 변경 이벤트 처리
        />
      </div>

      {/* ✅ 문진 제출 버튼 */}
      {!loading && (
        <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
          제출하기
        </Button>
      )}
    </div>
  );
}

export default FreeSurveyPage;
