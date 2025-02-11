import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo, clearUser } from "./redux/authSlice";
import { API_URL } from "./constant";
import { fetchWithAuth } from "./common/fetchWithAuth.js";

// ✅ 기존 페이지 (홈, 로그인, 회원가입, 마이페이지)
import Home from "./component/Home";
import Login from "./component/Login";
import MyPage from "./component/member/MyPage";
import RegisterMember from "./component/member/RegisterMember";
import RegisterDoctor from "./component/doctor/RegisterDoctor";

// ✅ 공지사항 관련 컴포넌트
import NoticeList from "./component/notice/NoticeList";
import NoticeForm from "./component/notice/NoticeForm";
import NoticeView from "./component/notice/NoticeView";

// ✅ 커뮤니티 관련 컴포넌트
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";

// ✅ 관리자 페이지
import UnauthorizedPage from "./component/UnAuthorizedPage";
import Admin from "./component/admin/Admin";

// ✅ 공통 UI (헤더, 푸터)
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";

// ✅ 문진(Survey) 관련 컴포넌트
import SurveyMain from "./component/survey/SurveyMain";
import FreeSurvey from "./component/survey/FreeSurvey";
import PaidSurvey from "./component/survey/PaidSurvey";
import PaidSurveyResultPage from "./component/survey/PaidSurveyResult"; // ✅ 변경된 컴포넌트

function App() {
  // Redux의 상태를 가져옴 (로그인된 사용자 정보 및 로그인 여부)
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ 사용자가 로그인되어 있지만 user 정보가 없는 경우, 서버에서 정보를 가져옴
  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUserInfo());
    }
  }, [user, isLoggedIn, dispatch]);

  // ✅ 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      await fetchWithAuth(`${API_URL}auth/logout`, { method: "POST" });
      dispatch(clearUser()); // Redux에서 사용자 정보 삭제
      navigate("/"); // 홈으로 리디렉트
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="App">
      {/* ✅ 공통 헤더 */}
      <Header />

      {/* ✅ 페이지별 라우팅 */}
      <Routes>
        {/* ✅ 홈 페이지 */}
        <Route path="/" element={<Home />} />

        {/* ✅ 사용자 관련 페이지 */}
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/registerDoctor" element={<RegisterDoctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<MyPage />} />

        {/* ✅ 공지사항 */}
        <Route path="/notices" element={<NoticeList />} />
        <Route path="/notices/new" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeView />} />

        {/* ✅ 커뮤니티 */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />

        {/* ✅ 관리자 페이지 */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ✅ 문진 관련 라우트 추가 */}
        <Route path="/survey" element={<SurveyMain />} /> {/* 문진 메인 (무료/유료 선택) */}
        <Route path="/survey/free" element={<FreeSurvey />} /> {/* 무료 문진 */}
        <Route path="/survey/paid" element={<PaidSurvey />} /> {/* 유료 문진 */}
        <Route path="/survey/paid/result" element={<PaidSurveyResult />} /> {/* ✅ 유료 문진 결과 페이지 */}
      </Routes>

      {/* ✅ 공통 푸터 */}
      <Footer />
    </div>
  );
}

export default App;
