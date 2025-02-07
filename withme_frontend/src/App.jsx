import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import StudentList from "./component/StudentList";
import AddStudent from "./component/AddStudent";
import Login from "./component/Login";
import MyPage from "./component/member/MyPage.jsx";
import ViewStudent from "./component/ViewStudent";
import EditStudent from "./component/EditStudent";
import RegisterMember from "./component/member/RegisterMember";
// 커뮤니티
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo, clearUser } from "./redux/authSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import UnauthorizedPage from "./component/UnAuthorizedPage.jsx";
import { API_URL } from "./constant";
import Home from "./component/Home";
import HomeIcon from "@mui/icons-material/Home";
import { fetchWithAuth } from "./common/fetchWithAuth.js"; // 홈 아이콘 추가
// 문진 검사 관련 추가
import SurveyPage from "./component/survey/SurveyPage";
import FreeSurveyPage from "./component/survey/FreeSurveyPage";
import PaidSurveyPage from "./component/survey/PaidSurveyPage";

/**
 * App 컴포넌트
 * - 애완견 건강 문진검사 기능 추가됨.
 * - 로그인한 사용자가 무료회원이면 `/survey/free` 이동
 * - 유료회원이면 `/survey/paid` 이동
 */
function App() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      await persistor.purge();
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 애완견 건강 문진검사 페이지 이동 (무료/유료 체크)
  const handleSurveyNavigation = () => {
    if (isLoggedIn) {
      if (user.userType === "FREE") {
        navigate("/survey/free");
      } else if (user.userType === "PAID") {
        navigate("/survey/paid");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="App">
      {/* 헤더 부분 */}
      <AppBar position="static">
        <Toolbar>
          <HomeIcon />
          <Typography variant="h3" style={{ flexGrow: 1 }}>
            {isLoggedIn && (
              <Button color="inherit" component={Link} to={`/mypage/${user?.id}`}>
                마이페이지
              </Button>
            )}
            <Button color="inherit" component={Link} to="/posts">
              커뮤니티
            </Button>
            <Button color="inherit" onClick={handleSurveyNavigation}>
              애완견 건강 문진검사
            </Button>
          </Typography>
          {isLoggedIn ? (
            <>
              <Typography
                variant="body1"
                style={{ marginRight: "10px", fontSize: "14px" }}>
                {user.name}{" "}
                {user.roles?.includes("ROLE_ADMIN") ? "(관리자)" : "(사용자)"}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 라우팅 부분 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listStudent" element={<StudentList />} />
        <Route path="/addStudent" element={user?.roles?.includes("ROLE_ADMIN") ? <AddStudent /> : <Navigate to="/unauthorized" replace />} />
        <Route path="/viewStudent/:id" element={<ViewStudent />} />
        {isLoggedIn && user?.roles?.includes("ROLE_ADMIN") && (
          <Route path="/editStudent/:id" element={<EditStudent />} />
        )}
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<MyPage />} />
        {/* 커뮤니티 */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* 문진 검사 관련 추가 */}
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/survey/free" element={<FreeSurveyPage />} />
        <Route path="/survey/paid" element={<PaidSurveyPage />} />
      </Routes>
    </div>
  );
}

export default App;
