import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import "../../assets/css/member/SignupSuccess.css";

/*
 * 수의사 회원가입 완료 후 로드될 컴포넌트
 */
function DoctorSignupSuccess() {
  const location = useLocation();
  const { name } = location.state || {};

   useEffect(() => {
      document.body.style.backgroundColor = "#FEF9F6";
      return () => {
        document.body.style.backgroundColor = "";
      };
    }, []);

    const handleNavigation = (e) => {
      e.preventDefault();
      if (!isLoggedIn || !user) {
        alert('로그인 후 이용 가능합니다.');
        navigate("/login");
        return;
      }
    };

  return (
    <div className="container" style={{ backgroundColor: "#FEF9F6" }}>
      <img src="assets/images/dog.png" alt="dog image" />
      <div className="message">
        <p className="title">
          회원가입이 <span style={{ fontWeight: 'bold' }}>완료</span> 되었습니다.
        </p>
        <p>
          <span className="userName" style={{ fontWeight: 'bold', marginRight: "5px" }}>
            {name}
          </span>
           수의사님을 진심으로 환영합니다.
        </p>
        <p className="last">
          아래 링크에서 권한 신청 및 관리자 승인 후 관련 서비스 이용이 가능합니다.<br /><br />
          <Link onClick="handleNavigation" to="/registerDoctor" style={{ margin: "16x auto 20px", fontWeight: 'bold', color: "#FF6946", fontSize: "1.2em" }}>[ 수의사 신청 하러 가기 ]</Link>
        </p>
      </div>
      <div className="btn-wrap">
        <button id="homeBtn" onClick={() => (window.location.href = '/')}>
          홈으로
        </button>
        <button
          id="loginBtn"
          onClick={() => (window.location.href = '/login')}
        >
          로그인
        </button>
      </div>
    </div>
  );
}

export default DoctorSignupSuccess;
