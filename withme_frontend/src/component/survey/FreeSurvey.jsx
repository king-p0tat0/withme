import { DataGrid } from "@mui/x-data-grid";
import { Button, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { API_URL } from "../../constant.js"; // ✅ API URL 상수
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

export default function FreeSurveyPage() {
    const [questions, setQuestions] = useState([]); // 문진 질문 목록
    const [answers, setAnswers] = useState({}); // 선택한 답변 저장
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const surveyId = 1; // ✅ 무료 설문 ID (고정값)

    useEffect(() => {
        fetchQuestions();
    }, []);

    /** ✅ 문진 질문 가져오기 */
    const fetchQuestions = async () => {
        try {
            setLoading(true);

            // 1. 질문 데이터 가져오기
            const questionResponse = await fetchWithAuth(`${API_URL}questions/free/${surveyId}`, { method: "GET" });

            if (!questionResponse.ok) {
                console.error("❌ 질문 데이터를 불러오지 못했습니다.", questionResponse.status);
                setLoading(false);
                return;
            }

            const questionData = await questionResponse.json();
            console.log("✅ 질문 데이터 로드 성공:", questionData);

            if (!questionData || questionData.length === 0) {
                console.warn("🚨 문진 질문이 없습니다.");
                setLoading(false);
                return;
            }

            // 2. 각 질문에 대한 선택지 데이터 가져오기
            const questionsWithChoices = await Promise.all(
                questionData.map(async (question) => {
                    const choiceResponse = await fetchWithAuth(`${API_URL}choices/question/${question.questionId}`, {
                        method: "GET",
                    });

                    if (!choiceResponse.ok) {
                        console.error(`❌ 선택지 데이터를 불러오지 못했습니다. (질문 ID: ${question.questionId})`);
                        return { ...question, choices: [] };
                    }

                    const choices = await choiceResponse.json();
                    return {
                        id: question.questionId,
                        seq: question.seq,
                        questionText: question.questionText,
                        choices: choices.map((choice) => ({
                            choiceId: choice.choiceId,
                            choiceText: choice.choiceText,
                            score: choice.score,
                        })),
                    };
                })
            );

            setQuestions(questionsWithChoices);
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
