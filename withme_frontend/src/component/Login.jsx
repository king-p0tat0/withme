import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../constant";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // 카카오 SDK 초기화 확인
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("087d59dd4896d1e8b281f1b6d514fc42");
        }
    }, []);

    // 카카오 로그인 함수
    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            console.error("Kakao 객체가 존재하지 않습니다.");
            return;
        }

        window.Kakao.Auth.login({
            success: function (authObj) {
                console.log("카카오 로그인 성공:", authObj);

                fetch(API_URL + "auth/kakao", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authObj.access_token}`,
                    },
                    body: JSON.stringify({ accessToken: authObj.access_token }),
                    credentials: "include",
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP 오류 - 상태 코드: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.accessToken) {
                            document.cookie = `accToken=${data.accessToken}; path=/; HttpOnly; Secure`;
                        }
                        if (data.refreshToken) {
                            document.cookie = `refToken=${data.refreshToken}; path=/; HttpOnly; Secure`;
                        }

                        dispatch(setUser(data));
                        navigate("/");
                    })
                    .catch((error) => {
                        console.error("서버 통신 실패:", error);
                    });
            },
            fail: function (error) {
                console.error("카카오 로그인 실패:", error);
            },
        });
    };

    // 네이버 로그인 함수
    const handleNaverLogin = () => {
        const NAVER_CLIENT_ID = "hXYnWsYZiuvXYNUZxohd";
        const REDIRECT_URI = "http://localhost:8080/login/oauth2/code/naver";
        const STATE = "RANDOM_STATE";
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;

        window.location.href = NAVER_AUTH_URL;
    };

    // 일반 로그인 함수
    const handleLogin = async () => {
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(API_URL + "auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
                credentials: "include",
            });

            const data = await response.json();
            if (data.status !== "success") {
                alert("이메일 또는 비밀번호를 확인하세요.");
                return;
            }

            dispatch(setUser({ id: data.id, name: data.name, email: email, roles: data.roles }));

            // 🔹 로그인 성공 후 원래 페이지로 이동 (없으면 홈)
            navigate(location.state?.from || "/");
        } catch (error) {
            console.error("로그인 요청 실패:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    // 엔터 키를 눌렀을 때 로그인 실행
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrap">
                <h1>로그인</h1>
                <div className="login-form">
                    <div className="id">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="이메일을 입력하세요."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}  // 엔터 키 이벤트 처리
                        />
                    </div>
                    <div className="password">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="비밀번호를 입력하세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}  // 엔터 키 이벤트 처리
                        />
                    </div>
                    <button className="loginBtn" onClick={handleLogin}>
                        로그인
                    </button>
                    <p>
                        아직 회원이 아니신가요? <Link to="/policy" className="signUpLink">회원가입</Link>
                    </p>
                </div>
            </div>
            <div className="login-sns">
                <p>소셜 계정으로 간편하게 로그인하세요!</p>
                <div className="snsLoginBtn-wrap">
                    <button className="snsLoginBtn kakaoBtn" onClick={handleKakaoLogin}>
                        <img src="/assets/images/icon/kakao.png" alt="카카오 로그인" />
                    </button>
                    <button className="snsLoginBtn naverBtn" onClick={handleNaverLogin}>
                        <img src="/assets/images/icon/naver.png" alt="네이버 로그인" />
                    </button>
                </div>
            </div>
        </div>
    );
}
