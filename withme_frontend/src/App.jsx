import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import StudentList from "./component/StudentList";
import AddStudent from "./component/AddStudent";
import Login from "./component/Login";
import MyPage from "./component/member/MyPage.jsx";
import ViewStudent from "./component/ViewStudent";
import EditStudent from "./component/EditStudent";
import RegisterMember from "./component/member/RegisterMember";
//공지사항
import NoticeList from "./component/notice/NoticeList";
import NoticeForm from "./component/notice/NoticeForm";
import NoticeView from "./component/notice/NoticeView";
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
import { fetchWithAuth } from "./common/fetchWithAuth.js"; // 홈 아이콘 추가

/**
 * App 컴포넌트
 * - React 애플리케이션의 루트 컴포넌트로, 라우팅 및 전체 애플리케이션 구조를 담당.
 * - 사용자는 학생 목록 조회, 학생 추가, 사용자 정보 관리 등의 기능에 접근 가능.
 *
 * 주요 기능:
 * 1. 리덕스 상태 관리:
 *    - Redux의 `useSelector`를 사용해 사용자 정보(`user`) 및 로그인 여부(`isLoggedIn`)를 확인.
 *    - `useDispatch`를 사용해 `fetchUserInfo`를 호출하여 사용자 정보를 가져옴.
 *
 * 2. 로그인 여부 및 권한에 따른 UI 제어:
 *    - 로그인 여부와 권한(`ROLE_ADMIN`)에 따라 다른 메뉴 버튼 및 접근 권한 제공.
 *
 * 3. 라우팅 처리:
 *    - React Router를 활용해 다양한 URL 경로에 따라 적절한 컴포넌트를 렌더링.
 *    - 관리자인 경우 학생 추가 및 편집 페이지에 접근 가능.
 *    - 로그인하지 않은 사용자는 접근 제한 페이지(`/unauthorized`)로 리디렉션.
 *
 * 4. 로그아웃 처리:
 *    - JWT 기반 로그아웃 구현. `fetchWithAuth`로 서버 로그아웃 요청 후 Redux Persist 데이터를 초기화하고 초기 화면으로 리디렉션.
 *
 * 5. `<PersistGate>`:
 *    - Redux Persist를 사용해 상태를 유지하며 비동기 저장소가 초기화될 때까지 대기.
 *    - `loading` 프로퍼티로 초기화 동안 렌더링할 컴포넌트를 설정 가능. 여기서는 `null`로 설정.
 *    - 비동기적으로 유지된 데이터를 안정적으로 불러오기 위해 사용.
 *
 * @returns App 컴포넌트 JSX
 */
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
      <AppBar position="static">
        <Toolbar>
          <HomeIcon />
          <Typography variant="h3" style={{ flexGrow: 1 }}>
            {isLoggedIn && (
              <Button
                color="inherit"
                component={Link}
                to={`/mypage/${user?.id}`}>
                마이페이지
              </Button>
            )}
            <Button color="inherit" component={Link} to="/posts">
              커뮤니티
            </Button>
            <Button color="inherit" component={Link} to="/notices">
              공지사항
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
      {/*라우팅 부분*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listStudent" element={<StudentList />} />
        <Route
          path="/addStudent"
          element={
            user?.roles?.includes("ROLE_ADMIN") ? (
              <AddStudent />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
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
      </Routes>
    </div>
  );
}

export default App;
