import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Typography, Tabs, Tab } from "@mui/material";
import TabPanel from "../elements/TabPanel";
import { NormalButton, DeleteButton } from "../elements/Button"; // 커스텀 버튼 가져오기

const NoticeList = () => {
  const [notices, setNotices] = useState([]); // 전체 공지사항 목록
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const [activeTab, setActiveTab] = useState(0); // 현재 선택된 탭 (0부터 시작)

  const categories = ["전체", "일반", "이벤트", "정책/운영", "긴급"];

  useEffect(() => {
    fetchNotices();
    checkAdmin(); // 관리자 여부 확인
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get("/api/notices"); // 공지사항 API 호출
      setNotices(response.data.data || []); // 공지사항 데이터 설정
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
      setNotices([]); // 오류 발생 시 notices를 빈 배열로 설정
    }
  };

  const checkAdmin = async () => {
    try {
      const response = await axios.get("/api/auth/userInfo"); // 사용자 정보 API 호출
      setIsAdmin(response.data.role === "ADMIN"); // role이 ADMIN인지 확인
    } catch (error) {
      console.error("사용자 정보를 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  const deleteNotice = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/notices/${id}`); // 삭제 API 호출
        alert("공지사항이 삭제되었습니다.");
        fetchNotices(); // 삭제 후 목록 갱신
      } catch (error) {
        console.error("공지사항 삭제 중 오류가 발생했습니다.", error);
        alert("공지사항 삭제에 실패했습니다.");
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // 선택된 탭 인덱스 설정
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        공지사항
      </Typography>

      {/* 관리자 등록 버튼 */}
      {isAdmin && (
        <Link to="/notices/new">
          <Button variant="contained" sx={{ mb: 2 }}>
            공지사항 등록
          </Button>
        </Link>
      )}
      <Link to="/notices/new">
        <NormalButton variant="contained" sx={{ mb: 2 }}>
          공지사항 등록
        </NormalButton>
      </Link>

      <DeleteButton variant="contained" sx={{ mb: 2 }}>
        삭제
      </DeleteButton>

      {/* 탭 메뉴 */}
      <Tabs
        value={activeTab}
        variant="fullWidth"
        onChange={handleTabChange}
        aria-label="noticeCategory">
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>

      {/* TabPanel - 각 탭에 맞는 콘텐츠 표시 */}
      {categories.map((category, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {category === "전체"
            ? notices.map((notice) => (
                <div key={notice.id}>
                  {/* 제목에 상세보기 링크 추가 */}
                  <Link
                    to={`/notices/${notice.id}`}
                    style={{ textDecoration: "none" }}>
                    <Typography
                      variant="h6"
                      color="primary"
                      style={{ cursor: "pointer" }}>
                      {notice.title}
                    </Typography>
                  </Link>
                  <Typography>{notice.content}</Typography>
                  {isAdmin && (
                    <>
                      <Link to={`/notices/edit/${notice.id}`}>
                        <NormalButton sx={{ mr: 1 }}>수정</NormalButton>
                      </Link>
                      <DeleteButton onClick={() => deleteNotice(notice.id)}>
                        삭제
                      </DeleteButton>
                    </>
                  )}
                </div>
              ))
            : notices
                .filter((notice) => notice.category === category)
                .map((notice) => (
                  <div key={notice.id}>
                    {/* 제목에 상세보기 링크 추가 */}
                    <Link
                      to={`/notices/${notice.id}`}
                      style={{ textDecoration: "none" }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        style={{ cursor: "pointer" }}>
                        {notice.title}
                      </Typography>
                    </Link>
                    <Typography>{notice.content}</Typography>
                    {isAdmin && (
                      <>
                        <Link to={`/notices/edit/${notice.id}`}>
                          <NormalButton sx={{ mr: 1 }}>수정</NormalButton>
                        </Link>
                        <DeleteButton onClick={() => deleteNotice(notice.id)}>
                          삭제
                        </DeleteButton>
                      </>
                    )}
                  </div>
                ))}
          {notices.filter((notice) => notice.category === category).length ===
            0 &&
            category !== "전체" && <p>해당 카테고리에 공지사항이 없습니다.</p>}
        </TabPanel>
      ))}
    </div>
  );
};

export default NoticeList;
