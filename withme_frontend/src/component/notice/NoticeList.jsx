import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../constant";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";
import { Typography, Tabs, Tab } from "@mui/material";
import TabPanel from "../elements/TabPanel";
import { useSelector } from "react-redux"; // Use Redux state
import { PrimaryButton, DeleteButton } from "../elements/CustomComponents";
import { fetchWithoutAuth, fetchWithAuth } from "../../utils/fetchWithAuth";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Get user and login status from Redux
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const categories = ["전체", "일반", "이벤트", "정책/운영", "긴급"];

  useEffect(() => {
    fetchNotices();
  }, []);

  // 공지사항 목록 가져오기
  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}notices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched Notices:", data);
      setNotices(data);
    } catch (error) {
      console.error(
        "공지사항을 불러오는 중 오류가 발생했습니다:",
        error.message
      );
      alert("공지사항 목록을 가져오는 데 실패했습니다.");
    }
  };

  // 공지사항 삭제
  const deleteNotice = async (id) => {
    if (!isLoggedIn || user.role !== "ADMIN") {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await fetchWithAuth(`/api/notices/${id}`, { method: "DELETE" });
        alert("공지사항이 삭제되었습니다.");
        fetchNotices(); // Refresh notices after deletion
      } catch (error) {
        console.error("공지사항 삭제 중 오류가 발생했습니다:", error.message);
        alert("공지사항 삭제에 실패했습니다.");
      }
    }
  };

  // 탭 변경 처리
  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        공지사항
      </Typography>

      {/* 관리자 등록 버튼 */}
      {isLoggedIn && user.role === "ADMIN" && (
        <Link to="/notices/new">
          <PrimaryButton variant="contained" sx={{ mb: 2 }}>
            공지사항 등록
          </PrimaryButton>
        </Link>
      )}

      {/* 탭 메뉴 */}
      <Tabs value={activeTab} variant="fullWidth" onChange={handleTabChange}>
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>

      {/* TabPanel */}
      {categories.map((category, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {notices
            .filter((notice) =>
              category === "전체" ? true : notice.category === category
            )
            .map((notice) => (
              <div key={notice.id}>
                <Link
                  to={`/notices/${notice.id}`}
                  style={{ textDecoration: "none" }}>
                  <Typography variant="h6" color="primary">
                    {notice.title}
                  </Typography>
                </Link>
                <Typography>{notice.content}</Typography>
                {isLoggedIn && user.role === "ADMIN" && (
                  <>
                    <Link to={`/notices/edit/${notice.id}`}>
                      <PrimaryButton sx={{ mr: 1 }}>수정</PrimaryButton>
                    </Link>
                    <DeleteButton onClick={() => deleteNotice(notice.id)}>
                      삭제
                    </DeleteButton>
                  </>
                )}
              </div>
            ))}
          {!notices.some((notice) =>
            category === "전체" ? true : notice.category === category
          ) && <p>해당 카테고리에 공지사항이 없습니다.</p>}
        </TabPanel>
      ))}
    </div>
  );
};

export default NoticeList;
