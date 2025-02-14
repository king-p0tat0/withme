import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

// 전문가 가입, 신청, 수정
import SignupDoctor from "./component/member/SignupDoctor"; // 수의사 회원가입 페이지
import RegisterDoctor from "./component/doctor/RegisterDoctor";
import DoctorApplicationStatus from "./component/doctor/DoctorApplicationStatus";
import DoctorApplicationEdit from "./component/doctor/DoctorApplicationEdit";

// 커뮤니티
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";

// 관리자
import Admin from "./component/admin/Admin";
import DoctorUpdate from "./component/admin/DoctorUpdate";
import Dashboard from "./component/admin/Dashboard";

// ✅ 회원 관련
import Login from "./component/Login";
import MyPage from "./component/member/MyPage.jsx";
import Policy from "./component/member/Policy"; // 약관정책
import RegisterMember from "./component/member/RegisterMember"; // 일반 회원가입 페이지
import SignupSuccess from "./component/member/SignupSuccess"; // 가입 완료
import DoctorSignupSuccess from "./component/member/DoctorSignupSuccess"; // 가입 완료

// ✅ 기타 페이지
import Home from "./component/Home";
import UnauthorizedPage from "./component/UnAuthorizedPage.jsx";
import Header from "./component/common/Header";
import Footer from "./component/common/Footer";
import NavBar from "./component/common/NavBar"

// ✅ 추가: 문진(survey) 관련 컴포넌트 import
import FreeSurvey from "./component/survey/FreeSurvey";
import FreeSurveyResult from "./component/survey/FreeSurveyResult";
import PaidSurvey from "./component/survey/PaidSurvey";
import PaidSurveyResult from "./component/survey/PaidSurveyResult";
import PaidSurveySelection from "./component/survey/PaidSurveySelection";
import SurveyMain from "./component/survey/SurveyMain";

// 쇼핑몰
import ItemList from "./component/shop/Product/ItemList";
import ItemView from "./component/shop/Product/ItemView";
import ItemAdd from "./component/shop/Product/ItemAdd";


function App() {
  // 리덕스 스토어의 상태를 가져오기 위해 useSelector 훅 사용, auth 슬라이스에서 user, isLoggedIn 상태를 가져옴
  // user: 사용자 정보 객체, isLoggedIn: 로그인 여부
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

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
      {/* Home을 제외한 모든 페이지에 NavBar 노출하도록 설정 */}
      {location.pathname !== "/" && <NavBar />}

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

        {/* ✅ 관리자 페이지 */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/doctor/status" element={<DoctorUpdate />} />
        <Route path="/survey-main" element={<SurveyMain />} />

        {/* 회원가입 페이지 */}
        <Route path="/policy" element={<Policy />} />
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/signupSuccess" element={<SignupSuccess />} />
        <Route path="/doctorSignupSuccess" element={<DoctorSignupSuccess />} />

        {/* ✅ 추가: 문진(survey) 관련 페이지 */}
        <Route path="/survey" element={<SurveyMain />} />
        <Route path="/survey/free" element={<FreeSurvey />} />
        <Route path="/survey/free/result" element={<FreeSurveyResult />} />
        <Route path="/survey/paid" element={<PaidSurvey />} />
        <Route path="/survey/paid/selection" element={<PaidSurveySelection />} />
        <Route path="/survey/paid/result" element={<PaidSurveyResult />} />
        {/* 쇼핑몰 */}
        <Route path="/item/list" element={<ItemList />} />
        <Route path="/item/view/:itemId" element={<ItemView user={user}/>} />
        <Route path="/item/add" element={<ItemAdd user={user}/>} />


        {/* 수의사 */}
        <Route path="/signupDoctor" element={<SignupDoctor />} />

        {/* ✅ 기타 페이지 */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
