import React, { useEffect } from "react";
//import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./component/Login";
import MyPage from "./component/member/MyPage.jsx";

import MemberForm from "./component/member/MemberForm";

//ui
import UiComponents from "./component/elements/UiComponents";

//공지사항
import NoticeList from "./component/notice/NoticeList";
import NoticeForm from "./component/notice/NoticeForm";
import NoticeView from "./component/notice/NoticeView";
// 전문가 신청, 수정
import RegisterDoctor from "./component/doctor/RegisterDoctor";
import DoctorApplicationStatus from "./component/doctor/DoctorApplicationStatus";
//커뮤니티
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "./redux/authSlice";
import { clearUser } from "./redux/authSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import UnauthorizedPage from "./component/UnAuthorizedPage.jsx";
import { API_URL } from "./constant";
import Home from "./component/Home";
import HomeIcon from "@mui/icons-material/Home";
import { fetchWithAuth } from "./common/fetchWithAuth.js";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";

//관리자
import Admin from "./component/admin/Admin";

// 회원가입
import Policy from "./component/member/Policy"; // 약관정책
import RegisterMember from "./component/member/RegisterMember"; // 회원정보 입력
import SignupSuccess from "./component/member/SignupSuccess"; // 가입 완료

import SurveyMain from "./component/survey/SurveyMain";

// 문진 관리
import FreeSurvey from "./component/survey/FreeSurvey";
import FreeSurveyResult from "./component/survey/FreeSurveyResult";
import PaidSurvey from "./component/survey/PaidSurvey";
import PaidSurveyResult from "./component/survey/PaidSurveyResult";
import PaidSurveySelection from "./component/survey/PaidSurveySelection";


function App() {
  // 리덕스 스토어의 상태를 가져오기 위해 useSelector 훅 사용, auth 슬라이스에서 user, isLoggedIn 상태를 가져옴
  // user: 사용자 정보 객체, isLoggedIn: 로그인 여부
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && isLoggedIn) {
      dispatch(fetchUserInfo());
    }
  }, [user, isLoggedIn, dispatch]);

  const handleLogout = async () => {
    try {
      await fetchWithAuth(`${API_URL}auth/logout`, {
        method: "POST"
      });
      dispatch(clearUser());
      await persistor.purge(); // Redux Persist 데이터 초기화
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="App">
      {/*헤더 부분*/}
      <Header />
      {/*라우팅 부분*/}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/listStudent" element={<StudentList />} />
        <Route
          path="/addStudent"
          element={
            user?.roles?.includes("ROLE_ADMIN") ? (
              <AddStudent />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
        /> */}
        {/* <Route path="/viewStudent/:id" element={<ViewStudent />} />
        {isLoggedIn && user?.roles?.includes("ROLE_ADMIN") && (
          <>
            <Route path="/editStudent/:id" element={<EditStudent />} />
          </>
        )} */}

        <Route path="/ui" element={<UiComponents />} />

        <Route path="/register" element={<MemberForm />} />
        {/* 전문가 신청페이지 */}
        <Route path="/registerDoctor" element={<RegisterDoctor user={user}/>} />

        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<MyPage />} />
        {/* 공지사항 목록 */}
        <Route path="/notices" element={<NoticeList />} />
        <Route path="/notices/new" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeView />} />

        {/* 게시글 목록 */}
        <Route path="/posts" element={<PostList />} />

        {/* 게시글 등록 */}
        <Route path="/posts/new" element={<PostForm />} />
        {/* 게시글 수정 */}
        <Route path="/posts/edit/:id" element={<PostForm />} />
        {/* 게시글 상세 보기 */}
        <Route path="/posts/:id" element={<PostView />} />

        {/* React Router는 상단부터 Routes에 정의된 Route를 순차적으로 검사. 모든 요청을 UnauthorizedPage로 리디렉션, 위에서 부터 순차적으로 진행됨 */}
        {/*<Route path="*" element={<UnauthorizedPage />} />*/}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/survey-main" element={<SurveyMain />} />

        {/* 회원가입 페이지 */}
        <Route path="/policy" element={<Policy />} />
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/signupSuccess" element={<SignupSuccess />} />

        {/* ✅ 추가: 문진(survey) 관련 페이지 */}
        <Route path="/survey" element={<SurveyMain />} />
        <Route path="/survey/free" element={<FreeSurvey />} />
        <Route path="/survey/free/result" element={<FreeSurveyResult />} />
        <Route path="/survey/paid" element={<PaidSurvey />} />
        <Route path="/survey/paid/selection" element={<PaidSurveySelection />} />
        <Route path="/survey/paid/result" element={<PaidSurveyResult />} />




      </Routes>
      <Footer />
    </div>
  );
}

export default App;
