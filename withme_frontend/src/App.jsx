import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo, clearUser } from "./redux/authSlice";
import { persistor } from "./redux/store";
import { API_URL } from "./constant";
import { fetchWithAuth } from "./common/fetchWithAuth.js";

// 페이지 컴포넌트
import Home from "./component/Home";
import StudentList from "./component/StudentList";
import AddStudent from "./component/AddStudent";
import Login from "./component/Login";
import MyPage from "./component/member/MyPage";
import ViewStudent from "./component/ViewStudent";
import EditStudent from "./component/EditStudent";
import RegisterMember from "./component/member/RegisterMember";
import PostList from "./component/posts/PostList";
import PostForm from "./component/posts/PostForm";
import PostView from "./component/posts/PostView";
import UnauthorizedPage from "./component/UnAuthorizedPage";
import Admin from "./component/admin/Admin";
import FreeSurveyPage from "./component/survey/FreeSurveyPage";
import PaidSurveyPage from "./component/survey/PaidSurveyPage";
import HomeIcon from "@mui/icons-material/Home";

/**
 * 🚀 App 컴포넌트 (Vite + React + JSX)
 * - Redux에서 로그인 상태 가져오기
 * - 로그인 여부에 따라 UI 변경 (로그인 / 로그아웃)
 * - 로그인 상태를 console.log()로 디버깅 가능하도록 설정
 */
function App() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 현재 로그인 상태:", { user, isLoggedIn });

    if (!user && isLoggedIn) {
      dispatch(fetchUserInfo());
    }
  }, [user, isLoggedIn, dispatch]);

  const handleLogout = async () => {
    try {
      await fetchWithAuth(`${API_URL}auth/logout`, {
        method: "POST",
      });
      dispatch(clearUser());
      await persistor.purge();
      window.location.href = "/";
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 🚀 애완견 건강 문진 검사 버튼 클릭 시 역할(Role)에 따라 이동
  const handleSurveyRedirect = () => {
    if (user?.role === "FREE") {
      navigate("/survey/free"); // 무료 문진 페이지
    } else if (user?.role === "PAID") {
      navigate("/survey/paid"); // 유료 문진 페이지
    } else {
      alert("문진 검사는 로그인 후 이용 가능합니다.");
      navigate("/login"); // 로그인 페이지 이동
    }
  };

  return (
    <div className="App">
      {/* ✅ 헤더 부분 */}
      <AppBar position="static">
        <Toolbar>
          <HomeIcon />
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {isLoggedIn && (
              <Button color="inherit" component={Link} to={`/mypage/${user?.id}`}>
                마이페이지
              </Button>
            )}
            <Button color="inherit" component={Link} to="/posts">
              커뮤니티
            </Button>
            <Button color="inherit" component={Link} to="/admin">
              관리자
            </Button>
            <Button color="inherit" onClick={handleSurveyRedirect}>
              애완견 건강 문진 검사
            </Button>
          </Typography>

          {isLoggedIn ? (
            <>
              <Typography variant="body1" style={{ marginRight: "10px", fontSize: "14px" }}>
                {user?.name}{" "}
                {user?.roles?.includes("ROLE_ADMIN") ? "(관리자)" : "(사용자)"}
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

      {/* ✅ 라우팅 설정 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listStudent" element={<StudentList />} />
        <Route
          path="/addStudent"
          element={user?.roles?.includes("ROLE_ADMIN") ? <AddStudent /> : <Navigate to="/unauthorized" replace />}
        />
        <Route path="/viewStudent/:id" element={<ViewStudent />} />
        {isLoggedIn && user?.roles?.includes("ROLE_ADMIN") && (
          <>
            <Route path="/editStudent/:id" element={<EditStudent />} />
          </>
        )}
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage/:id" element={<MyPage />} />

        {/* 🚀 커뮤니티 관련 라우트 */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />

        {/* 🚀 무료/유료 문진 검사 페이지 라우트 */}
        <Route path="/survey/free" element={<FreeSurveyPage />} />
        <Route path="/survey/paid" element={<PaidSurveyPage />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
