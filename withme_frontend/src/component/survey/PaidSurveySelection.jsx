import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

const PaidSurveySelectionPage = () => {
  const [topics, setTopics] = useState([]); // 문진 주제 목록
  const [selectedTopics, setSelectedTopics] = useState([]); // 선택된 주제 목록
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // JWT 포함
    },
    withCredentials: true,
  };

  useEffect(() => {
    if (!user || !user.id) {
      console.error("🚨 유저 정보 없음! 로그인 필요!");
      navigate("/login");
      return;
    }

    console.log("🔍 로그인된 사용자 정보:", user);
    fetchSurveyTopics();
    fetchSelectedTopics(user.id);
  }, [user, navigate]);

  const fetchSurveyTopics = () => {
    axios
      .get(`${API_URL}survey-topics/paid/2`, config)
      .then((response) => {
        console.log("유료 문진 주제 목록:", response.data);
        // 심혈관 건강 주제 삭제
        const filteredTopics = response.data.filter(
          (topic) => topic.topicName !== "심혈관 건강"
        );
        setTopics(filteredTopics);
      })
      .catch((error) => {
        console.error("❌ 문진 주제를 불러오지 못했습니다.", error);
        if (error.response && error.response.status === 401) {
          console.error("🔒 인증 문제! 다시 로그인 필요");
          navigate("/login");
        }
      });
  };

  const fetchSelectedTopics = (userId) => {
    axios
      .get(`${API_URL}user-selected-topics/${userId}`, config)
      .then((response) => {
        console.log("✅ 사용자 선택 주제:", response.data);
        setSelectedTopics(response.data.map((item) => item.topicId));
      })
      .catch((error) => console.error("❌ 사용자 선택 주제 불러오기 실패:", error));
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopics((prevSelected) =>
      prevSelected.includes(topicId)
        ? prevSelected.filter((id) => id !== topicId)
        : [...prevSelected, topicId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map((topic) => topic.topicId));
    }
  };

  const startPaidSurvey = () => {
    if (selectedTopics.length === 0) {
      alert("🚨 최소 한 개 이상의 주제를 선택해주세요!");
      return;
    }
    navigate("/survey/paid", { state: { selectedTopics } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        padding: "2rem",
        backgroundColor: "#fff3e0", // Very light orange
        minHeight: "100vh",
      }}
    >
      {/* Left Side: Survey Topics */}
      <Paper
        elevation={3}
        sx={{
          width: "45%",
          padding: "1rem",
          backgroundColor: "#ffe0b2", // Light orange
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#d67d00",
            backgroundColor: "#ffcc80",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          유료 문진 검사 주제 선택
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            marginBottom: "1rem",
            color: "#757575",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          문진을 진행할 주제를 선택하세요.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <Checkbox
            checked={selectedTopics.length === topics.length}
            onChange={handleSelectAll}
            color="primary"
          />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            전체 선택
          </Typography>
        </Box>

        {topics.length === 0 ? (
          <Typography variant="body2">❗ 문진 주제를 불러오지 못했습니다.</Typography>
        ) : (
          <List>
            {topics.map((topic) => (
              <ListItem
                key={topic.topicId}
                button
                onClick={() => handleTopicChange(topic.topicId)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#fff3e0",
                  margin: "5px 0",
                  borderRadius: "5px",
                  "&:hover": { backgroundColor: "#ffe0b2" },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={selectedTopics.includes(topic.topicId)}
                    onChange={() => handleTopicChange(topic.topicId)}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText primary={topic.topicName} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Right Side: Selected Topics */}
      <Paper
        elevation={3}
        sx={{
          width: "45%",
          padding: "1rem",
          backgroundColor: "#ffe0b2", // Light orange
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#d67d00",
            backgroundColor: "#ffcc80",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          선택한 주제:
        </Typography>
        {selectedTopics.length > 0 ? (
          <Box
            sx={{
              backgroundColor: "#fff3e0", // Very light orange
              padding: "1rem",
              borderRadius: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {topics
              .filter((topic) => selectedTopics.includes(topic.topicId))
              .map((topic) => (
                <Box
                  key={topic.topicId}
                  sx={{
                    backgroundColor: "#ffb74d",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  ✔️ {topic.topicName}
                </Box>
              ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "#757575" }}>
            검진 주제를 선택하세요.
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={startPaidSurvey}
          sx={{
            marginTop: "2rem",
            backgroundColor: "#ff8c00",
            "&:hover": {
              backgroundColor: "#d67d00",
            },
            padding: "1rem",
            fontSize: "1.1rem",
            borderRadius: "10px",
          }}
        >
          다음으로 문진 검사 시작하기
        </Button>
      </Paper>
    </Box>
  );
};

export default PaidSurveySelectionPage;
