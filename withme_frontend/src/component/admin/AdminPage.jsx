import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import NoticeList from "../notice/NoticeList.jsx";

const AdminPage = () => {
  return (
    <Box sx={{ padding: "20px" }}>
      {/* 관리자 페이지 제목 */}
      <Typography variant="h4" gutterBottom textAlign="center">
        관리자 공지사항 페이지
      </Typography>

      {/* 공지사항 리스트 */}
      <Card sx={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            공지사항 리스트
          </Typography>
          <NoticeList />
        </CardContent>
      </Card>

      {/* 등록 및 수정 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Button
          component={Link}
          to="/admin/create"
          variant="contained"
          color="primary">
          공지사항 등록
        </Button>
        <Button
          component={Link}
          to="/admin/edit/1" // 예시로 ID 1을 수정하도록 설정
          variant="contained"
          color="secondary">
          공지사항 수정
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPage;
