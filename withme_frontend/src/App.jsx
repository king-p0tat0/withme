import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "./redux/authSlice";
import { API_URL } from "./constant";
import { Snackbar, Alert, Badge } from "@mui/material";
import useWebSocket from "./hook/useWebSocket";

// ✅ 공지사항
import NoticeList from "./component/notice/NoticeList";
import NoticeForm from "./component/notice/NoticeForm";
import NoticeView from "./component/notice/NoticeView";

// ✅ 회원 관련
import Login from "./component/Login";
import MyPage from "./component/member/MyPage.jsx";
import Policy from "./component/member/Policy";
import RegisterMember from "./component/member/RegisterMember";
import SignupSuccess from "./component/member/SignupSuccess";
import OAuth2RedirectHandler from "./component/OAuth2RedirectHandler.jsx";
import MemberForm from "./component/member/MemberForm";

// ✅ 의사 관련
import RegisterDoctor from "./component/doctor/RegisterDoctor";
import DoctorApplicationStatus from "./component/doctor/DoctorApplicationStatus";
import DoctorApplicationEdit from "./component/doctor/DoctorApplicationEdit";
import DoctorDashboard from "./component/doctor/DoctorDashboard";
import DoctorMessageList from "./component/doctor/DoctorMessageList";

// ✅ 커뮤니티
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";

// ✅ 관리자
import Admin from "./component/admin/Admin";
import Dashboard from "./component/admin/Dashboard";

// ✅ 기타 페이지
import Home from "./component/Home";
import UnauthorizedPage from "./component/UnAuthorizedPage.jsx";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";

// ✅ 문진(survey) 관련
import FreeSurvey from "./component/survey/FreeSurvey";
import FreeSurveyResult from "./component/survey/FreeSurveyResult";
import PaidSurvey from "./component/survey/PaidSurvey";
import PaidSurveyResult from "./component/survey/PaidSurveyResult";
import PaidSurveySelection from "./component/survey/PaidSurveySelection";
import SurveyMain from "./component/survey/SurveyMain";

// 권한 기반 라우팅을 위한 ProtectedRoute 컴포넌트
const ProtectedRoute = ({ isAllowed, redirectPath = '/unauthorized', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function App() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { open: snackbarOpen, message: snackbarMessage } = useSelector((state) => state.snackbar);
  const { unreadCount } = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(null);

  // 🔍 사용자 정보 초기 로딩
  useEffect(() => {
    if (!user && isLoggedIn) {
      dispatch(fetchUserInfo());
    }
  }, [user, isLoggedIn, dispatch]);

  // 📡 WebSocket 연결 (useWebSocket Hook 사용)
  useWebSocket(user);

  // 알림 닫기
  const handleCloseNotification = () => setNotification(null);

  return (
    <div className="App">
      <Header unreadCount={unreadCount} />

      {/* 🔔 WebSocket 알림 표시 */}
      <Snackbar
        open={!!notification || snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="info"
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '0.9rem',
              fontWeight: 500
            }
          }}
        >
          {notification?.message || snackbarMessage}
        </Alert>
      </Snackbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registerDoctor" element={<RegisterDoctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<MyPage />} />

        {/* 공지사항 */}
        <Route path="/notices" element={<NoticeList />} />
        <Route path="/notices/new" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeView />} />

        {/* 게시글 */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />

        {/* 관리자 */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAllowed={!!user && user.roles.includes('ROLE_ADMIN')}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 회원가입 */}
        <Route path="/policy" element={<Policy />} />
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/signupSuccess" element={<SignupSuccess />} />

        {/* 문진(survey) */}
        <Route path="/survey/free" element={<FreeSurvey />} />
        <Route path="/survey/free/result" element={<FreeSurveyResult />} />
        <Route path="/survey/paid" element={<PaidSurvey />} />
        <Route path="/survey/paid/selection" element={<PaidSurveySelection />} />
        <Route path="/survey/paid/result" element={<PaidSurveyResult />} />

        {/* 전문의 관련 */}
        <Route
          element={
            <ProtectedRoute isAllowed={!!user && user.roles.includes('ROLE_DOCTOR')} />
          }
        >
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-messages" element={<DoctorMessageList />} />
          <Route path="/doctor/application/status" element={<DoctorApplicationStatus />} />
          <Route path="/doctor/application/edit" element={<DoctorApplicationEdit />} />
        </Route>

        {/* 기타 */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
