import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [rotateHead, setRotateHead] = useState("0deg");

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    // Add logic to hide hands and remove the breath class
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    // Add logic to show hands and add the breath class back
  };

  const handleUsernameFocus = (event) => {
    setIsUsernameFocused(true);
    let length = Math.min(event.target.value.length - 16, 19);
    setRotateHead(`${-length}deg`);
  };

  const handleUsernameBlur = () => {
    setIsUsernameFocused(false);
    setRotateHead("0deg");
  };

  const handleUsernameInput = (event) => {
    let length = Math.min(event.target.value.length - 16, 19);
    setRotateHead(`${-length}deg`);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <>
      <div className="center">
        <div className="ear ear--left"></div>
        <div className="ear ear--right"></div>
        <div className="face" style={{ "--rotate-head": rotateHead }}>
          <div className="eyes">
            <div className="eye eye--left">
              <div className="glow"></div>
            </div>
            <div className="eye eye--right">
              <div className="glow"></div>
            </div>
          </div>
          <div className="nose">
            <svg width="38.161" height="22.03">
              <path d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z" fill="#243946"></path>
            </svg>
            <div className="glow"></div>
          </div>
          <div className="mouth">
            <svg className="smile" viewBox="-2 -2 84 23" width="84" height="23">
              <path d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161" fill="none" strokeWidth="3" strokeLinecap="square" strokeMiterlimit="3"></path>
            </svg>
            <div className="mouth-hole"></div>
            <div className={`tongue ${isPasswordFocused ? "" : "breath"}`}>
              <div className="tongue-top"></div>
              <div className="line"></div>
              <div className="median"></div>
            </div>
          </div>
        </div>

        <div className="hands">
          <div className={`hand hand--left ${isPasswordFocused ? "hide" : ""}`}>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
          </div>
          <div className={`hand hand--right ${isPasswordFocused ? "hide" : ""}`}>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
            <div className="finger">
              <div className="bone"></div>
              <div className="nail"></div>
            </div>
          </div>
        </div>

        <div className="login">
          <label>
            <div className="fa fa-phone"></div>
            <input
              className="username"
              type="text"
              autoComplete="on"
              placeholder="이메일"
              value={email}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
              onInput={handleUsernameInput}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <div className="fa fa-commenting"></div>
            <input
              className="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="off"
              placeholder="비밀번호"
              value={password}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="password-button" onClick={togglePasswordVisibility}>
              비밀번호
            </button>
          </label>
          <button className="login-button">로그인</button>
        </div>

        <div className="social-buttons">
          <div className="social">
            <div className="fa fa-wechat"></div>
          </div>
          <div className="social">
            <div className="fa fa-weibo"></div>
          </div>
          <div className="social">
            <div className="fa fa-paw"></div>
          </div>
        </div>

        <div className="footer">광고</div>
      </div>
      <a
        className="inspiration"
        href="https://dribbble.com/shots/4485321-Login-Page-Homepage"
        target="_blank"
        rel="noopener"
      >
        <img
          src="https://cdn.dribbble.com/assets/logo-footer-hd-a05db77841b4b27c0bf23ec1378e97c988190dfe7d26e32e1faea7269f9e001b.png"
          alt="inspiration"
        />
      </a>
    </>
  );
}
