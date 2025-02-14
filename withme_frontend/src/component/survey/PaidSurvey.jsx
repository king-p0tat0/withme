import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth.js";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress, Button } from "@mui/material";

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
        // ✅ 쿼리 스트링 직접 추가
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
        setCurrentQuestions(grouped[selectedTopics[0]] || []);
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
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
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
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-6" style={{ textAlign: "center" }}>
        <h2>데이터를 불러오는 중...</h2>
        <LinearProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6" style={{ textAlign: "center" }}>
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} variant="contained">다시 시도</Button>
      </div>
    );
  }

  const numberedQuestions = currentQuestions.map((q, index) => ({
    ...q,
    seq: index + 1,
    id: q.questionId
  }));

  return (
    <div className="p-4" style={{ textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#D67D00",
        backgroundColor: "#FFF3E0",
        padding: "10px 20px",
        borderRadius: "10px",
        display: "inline-block",
        marginBottom: "20px"
      }}>
        유료 문진 검사
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px", fontSize: "1.2rem", fontWeight: "bold" }}>
          현재 주제: {selectedTopics[currentTopicIndex]} ({currentTopicIndex + 1} / {selectedTopics.length})
        </div>
        <LinearProgress
          variant="determinate"
          value={((currentTopicIndex + 1) / selectedTopics.length) * 100}
          sx={{
            height: "16px",
            borderRadius: "8px",
            backgroundColor: "#FFE0B2",
            '& .MuiLinearProgress-bar': {
              backgroundColor: "#FF8C00"
            }
          }}
        />
      </div>
      <div style={{ height: 700, width: "100%", marginTop: "20px" }}>
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
                backgroundColor: "#FFB74D", // ✅ 주황색 배경
                color: "#fff",
                textAlign: "center"
              },
              "& .MuiDataGrid-cell": {
                fontSize: "1rem",
                textAlign: "center"
              },
              "@media (max-width: 768px)": {
                "& .MuiDataGrid-columnHeaders": { fontSize: "1rem" },
                "& .MuiDataGrid-cell": { fontSize: "0.9rem" }
              }
            }}
          />
        ) : (
          <div>질문이 없습니다.</div>
        )}
      </div>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Button
          onClick={handlePrev}
          disabled={currentTopicIndex === 0}
          sx={{
            backgroundColor: "#FFE0B2",
            color: "#D67D00",
            fontSize: "1.1rem",
            width: "100%",
            maxWidth: "48%",
            "&:hover": { backgroundColor: "#FFB74D" },
            margin: "5px"
          }}
        >
          이전 주제
        </Button>
        {currentTopicIndex < selectedTopics.length - 1 ? (
          <Button
            onClick={handleNext}
            sx={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontSize: "1.1rem",
              width: "100%",
              maxWidth: "48%",
              "&:hover": { backgroundColor: "#FF7043" },
              margin: "5px"
            }}
          >
            다음 주제
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontSize: "1.1rem",
              width: "100%",
              maxWidth: "48%",
              "&:hover": { backgroundColor: "#FF7043" },
              margin: "5px"
            }}
          >
            제출하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaidSurveyPage;
