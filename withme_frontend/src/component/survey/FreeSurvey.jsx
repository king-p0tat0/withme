import { DataGrid } from "@mui/x-data-grid";
import { Button, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { API_URL } from "../../constant.js";  // ✅ 상위 디렉토리로 이동하여 정확한 경로로 수정
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

export default function FreeSurveyPage() {
    const [questions, setQuestions] = useState([]); // 문진 질문 목록
    const [answers, setAnswers] = useState({}); // 선택한 답변 저장
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const navigate = useNavigate();
    const surveyId = 1; // ✅ 실제 Survey ID를 변수로 설정

    useEffect(() => {
        fetchQuestions();
    }, [paginationModel]);


    /** ✅ 문진 질문 가져오기 */
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${API_URL}questions/free/1`, { method: "GET" });

            if (!response.ok) {
                console.error("❌ 문진 데이터를 불러오지 못했습니다.", response.status);
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("✅ 문진 데이터 로드 성공:", data);

            if (!data || data.length === 0) {
                console.warn("🚨 문진 질문이 없습니다.");
                setLoading(false);
                return;
            }

            // ✅ DataGrid에서 사용할 수 있도록 데이터 가공
            const formattedData = data.map((q) => ({
                id: q.questionId, // DataGrid에서 사용될 고유 ID
                seq: q.seq,
                questionText: q.questionText,
                choices: q.choices.map(choice => ({
                    choiceId: choice.choiceId,
                    choiceText: choice.choiceText,
                    score: choice.score
                }))
            }));

            setQuestions(formattedData);
            setTotalRows(data.length);
        } catch (error) {
            console.error("❌ 문진 데이터 요청 중 오류 발생:", error.message);
        } finally {
            setLoading(false);
        }
    };


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
            console.log("🚀 문진 제출 요청:", requestBody);

            const response = await fetchWithAuth(`${API_URL}questions/free`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                console.log("✅ 문진 제출 성공");
                setSnackbarMessage("문진이 성공적으로 제출되었습니다.");
                setSnackbarOpen(true);
                navigate("/survey/free/result", { state: { answers } });
            } else {
                console.error("❌ 응답 제출 실패", response.status);
                alert("문진 제출에 실패했습니다.");
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
                    maxHeight: "150px",
                    overflow: "auto",
                    whiteSpace: "nowrap"
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
        <div style={{ height: 700, width: "100%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>무료 문진 검사</h2>

            {/* DataGrid */}
            <DataGrid
                rows={questions}
                columns={columns}
                rowCount={totalRows}
                paginationMode="server"
                pageSizeOptions={[5, 10, 20]}
                paginationModel={paginationModel}
                onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
                disableRowSelectionOnClick
                loading={loading}
                rowHeight={100}
            />

            {/* 문진 제출 버튼 */}
            {!loading && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    style={{ marginTop: "20px" }}
                >
                    제출하기
                </Button>
            )}

            {/* 스낵바 메시지 */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
}
