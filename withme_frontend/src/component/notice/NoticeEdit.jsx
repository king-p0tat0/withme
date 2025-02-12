import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

const NoticeCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/notices", { title, content });
      if (response.status === 200) {
        alert("공지사항이 등록되었습니다.");
        navigate("/notices"); // 공지사항 목록 페이지로 이동
      }
    } catch (error) {
      console.error("공지사항 등록 중 오류 발생:", error.message);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        공지사항 등록
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="제목"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="내용"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          등록하기
        </Button>
      </form>
    </div>
  );
};

export default NoticeCreate;
