import "./Header.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import { Helmet } from "react-helmet"; // 폰트

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await fetchWithAuth(`${API_URL}auth/logout`, {
        method: "POST",
      });
      dispatch(clearUser());
      window.location.href = "/"; // 홈으로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
    }
  };

  return (
    <>
      <Helmet>
        <title>행복한 반려생활의 시작, 위드미</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/images/favicon.ico" />
      </Helmet>
      <header>
        <div className="gnb-container">
          <ul className="gnb">
            {isLoggedIn ? (
              <>
                <li>{user.name}님</li>
                {user?.roles?.includes("ROLE_ADMIN") && (
                  <li>
                    <Link to="/admin">관리자 페이지</Link>
                  </li>
                )}
                <li>
                  <Link to="/" onClick={handleLogout} className="logout-btn">
                    로그아웃
                  </Link>
                </li>
                <li>
                  <Link to={`/mypage/${user.id}`}>마이페이지</Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">로그인</Link>
              </li>
            )}

            {!isLoggedIn && (
              <li className="join-us">
                <Link to="/register">회원가입</Link>
                <span className="tooltip">+2,000P</span>
              </li>
            )}

            <li>
              <Link to="/cart" className="cart-btn" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingBasket} />
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;