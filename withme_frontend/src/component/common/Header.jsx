import "../../assets/css/common/Header.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBasket,
  faCaretDown
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import { Helmet } from "react-helmet";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const adminDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setIsAdminOpen(false); // 드롭다운 외부 클릭 시 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 클릭 이벤트 추가
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 클린업
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetchWithAuth(`${API_URL}auth/logout`, { method: "POST" });
      dispatch(clearUser());
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleMypageClick = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
    } else if (user.roles.includes("ROLE_ADMIN")) {
      alert("일반 회원만 마이페이지를 이용할 수 있습니다.");
    } else {
      navigate(`/mypage/${user.id}`);
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
          <ul className="gnb" style={{ fontWeight: "bold" }}>
            <Link to="/">
              <img
                src="/assets/images/text_logo.png"
                alt="텍스트 로고"
                className="textLogo"
              />
            </Link>
            {isLoggedIn ? (
              <>
                <li style={{ color: "#333" }}>{user.name}님</li>
                {user.roles.includes("ROLE_ADMIN") && (
                  <li ref={adminDropdownRef}>
                    <button
                      className="admin-btn"
                      onClick={() => setIsAdminOpen(!isAdminOpen)}>
                      관리자 <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                    {isAdminOpen && (
                      <ul className="admin-dropdown">
                        <li>
                          <Link to="/admin">관리자 페이지</Link>
                        </li>
                        <li>
                          <Link to="/doctor/status">수의사 신청상태</Link>
                        </li>
                        <li>
                          <Link to="/doctor/edit">수의사 수정페이지</Link>
                        </li>
                      </ul>
                    )}
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
                {user.roles.includes("PENDING_DOCTOR") && (
                  <li>
                    <Link to={`/doctor/register`}>수의사 신청</Link>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link to="/login">로그인</Link>
              </li>
            )}

            {!isLoggedIn && (
              <li className="join-us">
                <Link to="/policy">회원가입</Link>
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
