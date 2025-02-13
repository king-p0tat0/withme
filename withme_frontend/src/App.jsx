import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo, clearUser } from "./redux/authSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import { API_URL } from "./constant";
import { fetchWithAuth } from "./common/fetchWithAuth.js";

// ✅ 공지사항
import NoticeList from "./component/notice/NoticeList";
import NoticeForm from "./component/notice/NoticeForm";
import NoticeView from "./component/notice/NoticeView";

// ✅ 커뮤니티
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";

// ✅ 관리자 페이지
import Admin from "./component/admin/Admin";

// ✅ 회원 관련
import Login from "./component/Login";
import MyPage from "./component/member/MyPage.jsx";
import Policy from "./component/member/Policy"; // 약관정책
import RegisterMember from "./component/member/RegisterMember"; // 회원정보 입력
import SignupSuccess from "./component/member/SignupSuccess"; // 가입 완료

// ✅ 의사 관련
import RegisterDoctor from "./component/doctor/RegisterDoctor";

// ✅ 기타 페이지
import Home from "./component/Home";
import UnauthorizedPage from "./component/UnAuthorizedPage.jsx";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";

// ✅ 추가: 문진(survey) 관련 컴포넌트 import
import FreeSurvey from "./component/survey/FreeSurvey";
import FreeSurveyResult from "./component/survey/FreeSurveyResult";
import PaidSurvey from "./component/survey/PaidSurvey";
import PaidSurveyResult from "./component/survey/PaidSurveyResult";
import PaidSurveySelection from "./component/survey/PaidSurveySelection";
import SurveyMain from "./component/survey/SurveyMain";

function App() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && isLoggedIn) {
      dispatch(fetchUserInfo());
    }
  }, [user, isLoggedIn, dispatch]);

  const handleLogout = async () => {
    try {
      await fetchWithAuth(`${API_URL}/auth/logout`, {
        method: "POST"
      });
      dispatch(clearUser());
      await persistor.purge();
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="App">
      <Header />
      {/* 라우팅 부분 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registerDoctor" element={<RegisterDoctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<MyPage />} />

        {/* ✅ 공지사항 */}
        <Route path="/notices" element={<NoticeList />} />
        <Route path="/notices/new" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeView />} />

        {/* ✅ 게시글 */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />

        {/* ✅ 관리자 페이지 */}
        <Route path="/admin" element={<Admin />} />

        {/* ✅ 회원가입 관련 */}
        <Route path="/policy" element={<Policy />} />
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/signupSuccess" element={<SignupSuccess />} />

        {/* ✅ 추가: 문진(survey) 관련 페이지 */}
        <Route path="/survey/free" element={<FreeSurvey />} />
        <Route path="/survey/free/result" element={<FreeSurveyResult />} />
        <Route path="/survey/paid" element={<PaidSurvey />} />
        <Route path="/survey/paid/selection" element={<PaidSurveySelection />} />
        <Route path="/survey/paid/result" element={<PaidSurveyResult />} />

        {/* ✅ 기타 페이지 */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;