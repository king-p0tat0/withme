import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("로그인 실패:", errorData); // 에러 로그 출력

        // 에러 메시지에 따라 얼럿 표시
        if (errorData.message === "Invalid email") {
          alert("이메일을 확인해주세요.");
        } else if (errorData.message === "Invalid password") {
          alert("비밀번호를 확인해주세요.");
        } else {
          alert("로그인 실패. 다시 시도해주세요.");
        }
        return;
      }

      const data = await response.json();
      console.log("서버 응답 데이터:", data); // 서버 응답 데이터 출력

      const rolesString = data.roles; // "[ROLE_ADMIN]"
      const rolesArray = rolesString.replace(/[\[\]"]/g, "").split(",");

      dispatch(
        setUser({
          id: data.id,
          name: data.name,
          email: credentials.email,
          role: rolesArray[0].replace("ROLE_", "")
        })
      );

      navigate("/");
    } catch (error) {
      console.error("로그인 요청 실패:", error.message); // 네트워크 에러 로그 출력
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin(); // Enter 키 입력 시 로그인 실행
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px"
      }}>
      <TextField
        label="Email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
        style={{ width: "400px", marginBottom: "10px" }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
        style={{ width: "400px", marginBottom: "10px" }}
        error={!!errorMessage} // 오류 발생 시 빨간 테두리
        helperText={errorMessage} // 오류 메시지 표시
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "400px"
        }}>
        <Button variant="contained" onClick={handleLogin}>
          로그인
        </Button>
        {/* <Button variant="outlined" onClick={() => navigate("/register")}>
          회원가입
        </Button> */}
      </div>
    </div>
  );
}
