import React, { useState } from "react"; // useState 임포트 확인 gggggggggg
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Paper, Button, Box, Typography, TextField } from "@mui/material";
import img2 from "../../image/img2.png"; // 이미지 import

const PaidSurveyResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topicScores } = location.state || { topicScores: [] };
  const [consultationContent, setConsultationContent] = useState(""); // 상담 내용 상태

  // 문항 수 정의
  const topicQuestionsCount = {
    1: 15,
    2: 16,
    3: 15,
    4: 12,
    6: 14,
    7: 15,
    8: 11,
    9: 10,
    10: 8,
    11: 14,
    12: 13,
    13: 13,
    14: 13,
    15: 15,
    16: 19,
    17: 13,
    18: 20,
    19: 15,
  };

  const topicNameMap = {
    1: "소화 건강",
    2: "피부 건강",
    3: "구강 건강",
    4: "체중 관리",
    6: "털과 모질 관리",
    7: "눈 건강",
    8: "행동 건강",
    9: "면역 체계",
    10: "간 건강",
    11: "신장 기능",
    12: "요로 건강",
    13: "에너지 수준",
    14: "노화 및 이동성",
    15: "기생충 관리",
    16: "백신 접종 이력",
    17: "스트레스 및 불안",
    18: "영양 균형",
    19: "알레르기 관리",
  };

  // "심혈관 건강" 필터링 및 데이터 재정렬
  const filteredTopicScores = topicScores
    .filter((item) => item.topic !== "5")
    .map((item) => ({
      ...item,
    }));

  let data = []; // data 변수 초기화

  if (filteredTopicScores.length === 0) {
    return (
      <Paper elevation={3} className="p-8 m-4 text-center">
        <h2 className="text-xl mb-4">결과를 찾을 수 없습니다</h2>
        <Button variant="contained" onClick={() => navigate("/survey/paid/selection")}>
          문진 시작하기
        </Button>
      </Paper>
    );
  } else {
    data = filteredTopicScores.map(({ topic, score }) => {
      const totalPerTopic = topicQuestionsCount[topic] * 5;
      const topicName = topicNameMap[topic] || "알 수 없는 주제";
      return {
        name: topicName,
        score,
        total: totalPerTopic,
        topicId: topic,
      };
    });
  }

  // 주제별 색상 정의 (파스텔 톤)
  const topicColors = {
    1: "#FFB3BA",
    2: "#FFDFBA",
    3: "#FFFFBA",
    4: "#BaffC9",
    6: "#BAE1FF",
    7: "#D3CEE3",
    8: "#F5E6CC",
    9: "#C8E6C9",
    10: "#FFCCBC",
    11: "#D1C4E9",
    12: "#F48FB1",
    13: "#A5D6A7",
    14: "#90CAF9",
    15: "#B39DDB",
    16: "#80DEEA",
    17: "#CE93D8",
    18: "#FFAB91",
    19: "#80CBC4",
  };

    const handleConsultationSubmit = () => {
        // 여기에 상담 내용을 서버로 전송하는 로직을 추가할 수 있습니다.
        console.log("상담 내용:", consultationContent);
        // 예: API 호출 또는 다른 페이지로 이동
        alert("상담 요청이 전송되었습니다.");
    };

  return (
    <Paper elevation={3} className="p-8 m-4" style={{ textAlign: "center" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: "30px" }}>
        <img src={img2} alt="Pet" style={{ width: "50px", marginRight: "15px" }} />
        <Typography variant="h4" style={{
          fontWeight: "bold",
          color: "#D67D00",
          backgroundColor: "#FFF3E0",
          padding: "10px 20px",
          borderRadius: "10px",
          display: "inline-block",
        }}>
          유료 문진 검사 결과 🐾
        </Typography>
      </Box>

      {/* ✅ 주제별 점수 (한 줄에 여러 개씩 표시) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        {filteredTopicScores.map(({ topic, score }) => {
          const totalPerTopic = topicQuestionsCount[topic] * 5;
          const topicName = topicNameMap[topic] || "알 수 없는 주제";
          return (
            <Box key={topic} sx={{
              backgroundColor: "#FFF3E0",
              color: "#D67D00",
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "10px",
              margin: "5px",
              width: "auto",
              minWidth: "200px", // 최소 너비 설정
              textAlign: "center",
            }}>
              {topicName} : {score} / {totalPerTopic}점
            </Box>
          );
        })}
      </Box>

      {/* ✅ BarChart 그래프 */}
      <Box sx={{ height: 500, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" tickFormatter={() => ""} style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="score" yAxisId="left">
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={topicColors[entry.topicId] || "#8884d8"} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* 전문의 상담 섹션 */}
      <Box sx={{
        marginTop: "50px",
        padding: "30px",
        border: "2px solid #FFCCBC", // 연한 코랄 색상
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "transparent" // 배경색 제거
      }}>
        <Typography variant="h5" sx={{
          fontWeight: "bold",
          color: "black",
          marginBottom: "20px"
        }}>
          전문의에게 상담하기
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="상담 내용을 입력해주세요..."
          value={consultationContent}
          onChange={(e) => setConsultationContent(e.target.value)}
          sx={{
            marginBottom: "20px",
            backgroundColor: "white",
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConsultationSubmit}
          disabled={!consultationContent.trim()}
          sx={{
            backgroundColor: "#D67D00",
            '&:hover': {
              backgroundColor: "#B25900",
            },
            '&:disabled': {
              backgroundColor: "#FFB366",
            }
          }}
        >
          상담 요청하기
        </Button>
      </Box>
    </Paper>
  );
};

export default PaidSurveyResultPage;
