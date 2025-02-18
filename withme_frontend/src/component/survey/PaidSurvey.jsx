import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress, Button, Typography, Box } from "@mui/material";
import { styled } from '@mui/system';

const FancyLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f2dcd0', // Light Peach
    '& .MuiLinearProgress-bar': {
        backgroundImage: 'linear-gradient(to right, #e9967a, #f08080)', // Coral gradients
        borderRadius: 10,
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
                if (!Array.isArray(data)) throw new Error("데이터 형식이 올바르지 않습니다.");

                const grouped = selectedTopics.reduce((acc, topic) => {
                    acc[topic] = data.filter(q => String(q.topicId) === String(topic));
                    return acc;
                }, {});

                setGroupedQuestions(grouped);
                setQuestions(data);

                // currentQuestions 설정 로직 수정
                const initialTopic = selectedTopics[0];
                if (grouped[initialTopic]) {
                    setCurrentQuestions(grouped[initialTopic]);
                } else {
                    setCurrentQuestions([]);
                }

                // topicNames 설정
                const names = {};
                [
                    { topic_id: 1, topic_name: '소화 건강' },
                    { topic_id: 2, topic_name: '피부 건강' },
                    { topic_id: 3, topic_name: '구강 건강' },
                    { topic_id: 4, topic_name: '체중 관리' },
//                     { topic_id: 5, topic_name: '심혈관 건강' },
                    { topic_id: 5, topic_name: '털과 모질 관리' },
                    { topic_id: 6, topic_name: '눈 건강' },
                    { topic_id: 7, topic_name: '행동 건강' },
                    { topic_id: 8, topic_name: '면역 체계' },
                    { topic_id: 9, topic_name: '간 건강' },
                    { topic_id: 10, topic_name: '신장 기능' },
                    { topic_id: 11, topic_name: '요로 건강' },
                    { topic_id: 12, topic_name: '에너지 수준' },
                    { topic_id: 13, topic_name: '노화 및 이동성' },
                    { topic_id: 14, topic_name: '기생충 관리' },
                    { topic_id: 15, topic_name: '백신 접종 이력' },
                    { topic_id: 16, topic_name: '스트레스 및 불안' },
                    { topic_id: 17, topic_name: '영양 균형' },
                    { topic_id: 18, topic_name: '알레르기 관리' }
                ].forEach(item => {
                    names[item.topic_id] = item.topic_name;
                });
                setTopicNames(names);

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
        navigate("/survey/paid/result", { state: { topicScores } });
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: 'center' }}>
          {params.row.choices.map((choice, index) => (
            <label key={choice.choiceId} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name={`question-${params.row.questionId}`}
                value={choice.choiceId}
                onChange={() => handleAnswerChange(params.row.questionId, choice.choiceId, index)}
                checked={answers[params.row.questionId]?.choiceId === choice.choiceId}
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

    return (
        <Box sx={{
            padding: "20px",
            textAlign: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "#f8f0e3", // Light Peach
            borderRadius: "10px",
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)"
        }}>
            <Typography variant="h4" sx={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#e4717a", // Coral
                backgroundColor: "#f9e7e7", // Very Light Peach
                padding: "10px 20px",
                borderRadius: "10px",
                display: "inline-block",
                marginBottom: "20px"
            }}>
                유료 문진 검사
            </Typography>
            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="subtitle1" sx={{
                    marginBottom: "15px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#666" // Dark Gray
                }}>
                    현재 주제: {topicNames[selectedTopics[currentTopicIndex]]} ({currentTopicIndex + 1} / {selectedTopics.length})
                </Typography>
                <FancyLinearProgress
                    variant="determinate"
                    value={((currentTopicIndex + 1) / selectedTopics.length) * 100}
                />
            </Box>
            <Box sx={{ height: 700, width: "100%", marginTop: "20px" }}>
                {currentQuestions.length > 0 ? (
                    <DataGrid
                        rows={numberedQuestions}
                        columns={columns}
                        hideFooter={true}
                        disableRowSelectionOnClick
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                backgroundColor: "#f4cccc", // Light Coral
                                color: "#555", // Dark Gray
                                textAlign: "center"
                            },
                            "& .MuiDataGrid-cell": {
                                fontSize: "1rem",
                                textAlign: "center",
                                color: "#777", // Medium Gray
                            },
                        }}
                    />
                ) : (
                    <div>질문이 없습니다.</div>
                )}
            </Box>
            <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Button
                    onClick={handlePrev}
                    disabled={currentTopicIndex === 0}
                    variant="contained"
                    sx={{
                        backgroundColor: "#f2dcd0", // Light Peach
                        color: "#e4717a", // Coral
                        fontSize: "1.1rem",
                        width: "100%",
                        maxWidth: "48%",
                        "&:hover": { backgroundColor: "#f4cccc" }, // Light Coral
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
                            backgroundColor: "#e4717a", // Coral
                            color: "white",
                            fontSize: "1.1rem",
                            width: "100%",
                            maxWidth: "48%",
                            "&:hover": { backgroundColor: "#e75480" }, // Hot Pink
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
                            backgroundColor: "#e4717a", // Coral
                            color: "white",
                            fontSize: "1.1rem",
                            width: "100%",
                            maxWidth: "48%",
                            "&:hover": { backgroundColor: "#e75480" }, // Hot Pink
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
