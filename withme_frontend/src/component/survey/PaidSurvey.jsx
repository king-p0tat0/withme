import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress, Button, Typography, Box } from "@mui/material";
import { styled } from '@mui/system';
import img2 from "../../image/img2.png";

const FancyLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4E1',
    '& .MuiLinearProgress-bar': {
        backgroundImage: 'linear-gradient(to right, #FFB6C1, #FF69B4)',
        borderRadius: 20,
        transition: 'width 0.6s ease',
    },
}));

const PaidSurveyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const selectedTopics = location.state?.selectedTopics || [];
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topicNames, setTopicNames] = useState({});

    useEffect(() => {
        if (!location.state?.selectedTopics) {
            navigate("/survey/paid/selection");
            return;
        }
        if (!user || selectedTopics.length === 0) {
            alert("문진을 진행하려면 주제를 선택해야 합니다.");
            navigate("/survey/paid/selection");
            return;
        }

        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth(`${API_URL}questions/paid?topics=${selectedTopics.join(',')}`);
                if (!response.ok) throw new Error("질문을 불러오는데 실패했습니다.");
                const data = await response.json();

                const grouped = selectedTopics.reduce((acc, topic) => {
                    acc[topic] = data.filter(q => String(q.topicId) === String(topic));
                    return acc;
                }, {});

                setGroupedQuestions(grouped);
                setQuestions(data);

                const initialTopic = selectedTopics[0];
                if (grouped[initialTopic]) {
                    setCurrentQuestions(grouped[initialTopic]);
                } else {
                    setCurrentQuestions([]);
                }

            } catch (error) {
                console.error("질문 로딩 오류:", error);
                alert(`질문을 불러오는데 실패했습니다: ${error.message}`);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [user, selectedTopics, navigate, location.state]);

    const handleAnswerChange = (questionId, choiceId, index) => {
        const score = 5 - index;
        setAnswers(prev => ({ ...prev, [questionId]: { choiceId, score } }));
    };

    const handleSubmit = () => {
        if (!user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        const allAnswered = questions.every(q => answers[q.questionId]);
        if (!allAnswered) {
            alert("모든 문제에 답해주세요.");
            return;
        }
        const topicScores = selectedTopics.map(topic => {
            const topicQuestions = groupedQuestions[topic];
            const topicScore = topicQuestions.reduce((sum, q) => sum + (answers[q.questionId]?.score || 0), 0);
            return { topic, score: topicScore };
        });
        navigate("/survey/paid/result", { state: { topicScores, answers } }); // answers도 함께 전달
    };

    const handleNext = () => {
        const unansweredQuestion = currentQuestions.find(q => !answers[q.questionId]);
        if (unansweredQuestion) {
            alert("현재 주제의 모든 문제에 답해주세요.");
            return;
        }
        if (currentTopicIndex < selectedTopics.length - 1) {
            const nextTopic = selectedTopics[currentTopicIndex + 1];
            setCurrentTopicIndex(prev => prev + 1);
            setCurrentQuestions(groupedQuestions[nextTopic] || []);
        }
    };

    const handlePrev = () => {
        if (currentTopicIndex > 0) {
            const prevTopic = selectedTopics[currentTopicIndex - 1];
            setCurrentTopicIndex(prev => prev - 1);
            setCurrentQuestions(groupedQuestions[prevTopic] || []);
        }
    };

    const columns = [
        { field: "seq", headerName: "번호", flex: 0.5, headerAlign: "center", align: "center" },
        { field: "questionText", headerName: "질문", flex: 2, headerAlign: "center", align: "center" },
        {
            field: "choices",
            headerName: "선택지",
            flex: 3,
            headerAlign: "center", align: "center",
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: "10px", justifyContent: 'center' }}>
                    {params.row.choices.map((choice, index) => (
                        <label key={choice.choiceId} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name={`question-${params.row.questionId}`}
                                value={choice.choiceId}
                                onChange={() => handleAnswerChange(params.row.questionId, choice.choiceId, index)}
                                checked={answers[params.row.questionId]?.choiceId === choice.choiceId}
                                style={{ marginRight: "5px" }}
                            />
                            {choice.choiceText}
                        </label>
                    ))}
                </Box>
            ),
        },
    ];

    const numberedQuestions = currentQuestions.map((q, index) => ({
        ...q,
        seq: index + 1,
        id: q.questionId
    }));

    const progressValue = ((currentTopicIndex + 1) / selectedTopics.length) * 100;

    return (
        <Box sx={{
            padding: "20px",
            textAlign: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "#FFFBF8",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)"
        }}>
            <div style={{ borderBottom: "3px solid pink", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <img src={img2} alt="img2" style={{ height: "80px", marginRight: "15px" }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>유료 문진 검사</Typography>
            </div>

            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="subtitle1" sx={{
                    marginBottom: "15px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#555"
                }}>
                    현재 주제: {topicNames[selectedTopics[currentTopicIndex]]} ({currentTopicIndex + 1} / {selectedTopics.length})
                </Typography>
                <FancyLinearProgress variant="determinate" value={progressValue} />
                <Typography variant="body1" sx={{
                    marginTop: "5px",
                    fontSize: "1.2rem",
                    color: "#333"
                }}>{Math.round(progressValue)}%</Typography>
            </Box>

            <Box sx={{ height: 700, width: "100%", marginTop: "20px" }}>
                <DataGrid
                    rows={numberedQuestions}
                    columns={columns}
                    hideFooter={true}
                    disableRowSelectionOnClick
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            backgroundColor: "#FFE4E1",
                            color: "#333",
                            textAlign: "center"
                        },
                        "& .MuiDataGrid-cell": {
                            fontSize: "1rem",
                            textAlign: "center",
                            color: "#555",
                        },
                    }}
                />
            </Box>

            <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                <Button
                    onClick={handlePrev}
                    disabled={currentTopicIndex === 0}
                    variant="contained"
                    sx={{
                        backgroundColor: "#FFB6C1",
                        color: "#fff",
                        fontSize: "1.1rem",
                        '&:hover': { backgroundColor: "#FF69B4" },
                        margin: "5px"
                    }}
                >
                    이전 주제
                </Button>
                {currentTopicIndex < selectedTopics.length - 1 ? (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        sx={{
                            backgroundColor: "#FFB6C1",
                            color: "#fff",
                            fontSize: "1.1rem",
                            '&:hover': { backgroundColor: "#FF69B4" },
                            margin: "5px"
                        }}
                    >
                        다음 주제
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: "#FFB6C1",
                            color: "#fff",
                            fontSize: "1.1rem",
                            '&:hover': { backgroundColor: "#FF69B4" },
                            margin: "5px"
                        }}
                    >
                        제출하기
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default PaidSurveyPage;
