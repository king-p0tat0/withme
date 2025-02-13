import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import { fetchWithoutAuth } from "../../common/fetchWithAuth";
import axios from "axios";

/**
 * 회원가입 컴포넌트
 */
export default function RegisterMember() {
    // 입력된 회원 정보를 저장할 상태 변수
    const [member, setMember] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "", // 비밀번호 확인 상태 추가
        phone: "",
        address: "",
    });

    const [emailError, setEmailError] = useState(""); // 이메일 중복 체크 메시지 상태
    const [passwordError, setPasswordError] = useState(""); // 비밀번호 확인 오류 메시지 상태

    const navigate = useNavigate();

    // 회원 정보 입력 시 상태 변경
    const onMemberChange = (event) => {
        const { name, value } = event.target;
        setMember({ ...member, [name]: value });

        if (name === "email") {
            checkEmailDuplicate(value); // 이메일 입력 시 중복 체크 실행
        }

        if (name === "password" || name === "confirmPassword") {
            // 비밀번호 및 비밀번호 확인 값이 변경될 때마다 비밀번호 일치 여부 체크
            checkPasswordMatch(value);
        }
    };

    // 비밀번호 확인 함수
    const checkPasswordMatch = (value) => {
        if (member.password !== value) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordError(""); // 일치하면 오류 메시지 초기화
        }
    };

    // 이메일 중복 체크 함수 (fetch 대신 axios 사용)
    const checkEmailDuplicate = async (email) => {
        if (!email.includes("@")) return;

        try {
            const response = await axios.get(`${API_URL}members/checkEmail`, { params: { email } });
            const result = await response.data;

            if (result.status === "available") {
                setEmailError(""); // 사용 가능한 이메일이면 오류 메시지 초기화
            } else if (result.status === "duplicate") {
                setEmailError(result.message); // "이미 존재하는 이메일입니다."
            }
        } catch (error) {
            console.error("이메일 중복 체크 실패:", error.message);
        }
    };

    const formatPhoneNumber = (phone) => {
        if (phone.length === 11) {
            return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
        }
        return phone;
    };

    // 회원가입 처리
    const handleOnSubmit = async () => {
        try {
            console.log("회원가입 시작");

            // 변환된 전화번호로 회원 정보 업데이트
            const requestMember = { ...member, phone: formatPhoneNumber(member.phone) };

            const requestOptions = {
                method: "POST",
                body: JSON.stringify(requestMember),
            };

            const response = await fetchWithoutAuth(`${API_URL}members/register`, requestOptions);

            if (response.ok) {
                alert("회원가입이 완료되었습니다.");
                navigate("/signupSuccess", { state: { name: member.name } });
            } else {
                const errorData = await response.json();
                alert(`회원가입 실패: ${errorData.message || "오류 발생"}`);
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error.message);
            alert("회원가입 실패: 네트워크 또는 서버 오류");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
            <Typography variant="h4" style={{ marginBottom: "20px", fontWeight: "bold" }}>
                회원가입
            </Typography>
            <TextField
                label="이름"
                name="name"
                value={member.name}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
                placeholder="한글 2 ~ 8자 입력 가능"
            />
            <TextField
                label="이메일"
                name="email"
                value={member.email}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
                error={!!emailError} // 에러 여부 표시
                helperText={emailError} // 오류 메시지 표시
                placeholder="예: withme@dog.com"
            />
            <TextField
                label="비밀번호"
                name="password"
                type="password"
                value={member.password}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
                placeholder="영문, 숫자, 특수문자 포함 8 ~ 16자 입력 가능"
            />
            <TextField
                label="비밀번호 확인"
                name="confirmPassword"
                type="password"
                value={member.confirmPassword}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
                error={!!passwordError} // 비밀번호 불일치 시 오류 표시
                helperText={passwordError} // 비밀번호 불일치 메시지 표시
            />
            <TextField
                label="전화번호"
                name="phone"
                value={member.phone}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
                placeholder="'-'를 제외한 숫자만 입력 가능 (예: 01012341234)"
            />
            <TextField
                label="주소"
                name="address"
                value={member.address}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
            />
            <Button variant="contained" onClick={handleOnSubmit} disabled={!!emailError || !!passwordError}>
                회원가입
            </Button>
        </div>
    );
}
