import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constant";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleLogin = async () => {
        try {
            const formData = new URLSearchParams();
            formData.append("username", credentials.email);
            formData.append("password", credentials.password);

            const response = await fetch(API_URL + "auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
                credentials: "include",
            });

            const data = await response.json();
            if (data.status !== "success") {
                setErrorMessage(data.message || "로그인 실패");
                return;
            }
            console.log('name : '+ data.name)

            dispatch(setUser({ id: data.id, name: data.name, email: credentials.email, roles: data.roles }));
            navigate("/");
        } catch (error) {
            console.error("로그인 요청 실패:", error);
            setErrorMessage("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrap">
                <h1>로그인</h1>
                <div className="login-form">
                    <div className="id">
                        <label htmlFor="email">아이디</label>
                        <input type="text" id="email" name="email" placeholder="아이디를 입력하세요." value={credentials.email} onChange={handleChange} />
                    </div>
                    <div className="password">
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요." value={credentials.password} onChange={handleChange} />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button className="loginBtn" onClick={handleLogin}>로그인</button>
                    <p>아직 회원이 아니신가요? <Link to="/policy" className="signUpLink" >회원가입</Link></p>
                </div>
            </div>
            <div className="login-sns">
                <p>소셜 계정으로 간편하게 로그인하세요!</p>
                <div className="snsLoginBtn-wrap">
                    <button className="snsLoginBtn kakaoBtn"><img src="/assets/images/icon/kakao.png" alt="카카오 로그인" /></button>
                    <button className="snsLoginBtn naverBtn"><img src="/assets/images/icon/naver.png" alt="네이버 로그인" /></button>
                    <button className="snsLoginBtn googleBtn"><img src="/assets/images/icon/google.png" alt="구글 로그인" /></button>
                </div>
            </div>
        </div>
    );
}
