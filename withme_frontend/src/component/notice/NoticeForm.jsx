import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import { NormalButton, DeleteButton } from "../elements/Button"; // 커스텀 버튼 가져오기

const NoticeCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: ""
  });
  const navigate = useNavigate();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/notices", formData); // 등록 API 호출
      alert("공지사항이 등록되었습니다.");
      navigate("/notices"); // 등록 후 리스트 페이지로 이동
    } catch (error) {
      console.error("공지사항 등록 중 오류가 발생했습니다.", error);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>공지사항 등록</h1>
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="제목"
            variant="outlined"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormControl>

        {/* 내용 입력 */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="내용"
            variant="outlined"
            name="content"
            value={formData.content}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
        </FormControl>

        {/* 카테고리 선택 */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">카테고리를 선택하세요</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required>
            <MenuItem value="일반">일반</MenuItem>
            <MenuItem value="이벤트">이벤트</MenuItem>
            <MenuItem value="정책/운영">정책/운영</MenuItem>
            <MenuItem value="긴급">긴급</MenuItem>
          </Select>
        </FormControl>

        {/* 등록 버튼 */}
        <NormalButton type="submit">등록하기</NormalButton>
      </form>
    </div>
  );
};

export default NoticeCreate;
