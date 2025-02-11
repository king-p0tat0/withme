import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, Button } from "@mui/material";

const NoticeView = () => {
  const { id } = useParams(); // URL에서 공지사항 ID 가져오기
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null); // 공지사항 데이터 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부

  useEffect(() => {
    fetchNotice();
    checkAdmin();
  }, []);

  // 공지사항 데이터 가져오기
  const fetchNotice = async () => {
    try {
      const response = await axios.get(`/api/notices/${id}`); // 단일 공지사항 API 호출
      setNotice(response.data); // 공지사항 데이터 설정
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
      alert("공지사항을 불러오는 데 실패했습니다.");
      navigate("/notices"); // 실패 시 목록 페이지로 이동
    }
  };

  // 관리자 여부 확인
  const checkAdmin = async () => {
    try {
      const response = await axios.get("/api/auth/userInfo"); // 사용자 정보 API 호출
      setIsAdmin(response.data.role === "ADMIN"); // role이 ADMIN인지 확인
    } catch (error) {
      console.error("사용자 정보를 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  // 공지사항 삭제
  const deleteNotice = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/notices/${id}`); // 삭제 API 호출
        alert("공지사항이 삭제되었습니다.");
        navigate("/notices"); // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error("공지사항 삭제 중 오류가 발생했습니다.", error);
        alert("공지사항 삭제에 실패했습니다.");
      }
    }
  };

  if (!notice) return <p>공지사항을 불러오는 중입니다...</p>; // 로딩 상태 표시

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        {notice.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {notice.content}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        카테고리: {notice.category}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary">
        작성일: {new Date(notice.createdAt).toLocaleDateString()}
      </Typography>

      {/* 관리자만 수정/삭제 버튼 표시 */}
      {isAdmin && (
        <div style={{ marginTop: "20px" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/notices/edit/${id}`)}
            sx={{ marginRight: "10px" }}>
            수정
          </Button>
          <Button variant="contained" color="secondary" onClick={deleteNotice}>
            삭제
          </Button>
        </div>
      )}

      {/* 목록으로 돌아가기 버튼 */}
      <Button
        variant="text"
        onClick={() => navigate("/notices")}
        sx={{ marginTop: "20px" }}>
        목록으로 돌아가기
      </Button>
    </div>
  );
};

export default NoticeView;
