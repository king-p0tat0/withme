import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import {fetchWithAuth} from "../../common/fetchWithAuth";
import useDebounce from '../../hook/useDebounce'; // useDebounce 훅을 임포트합니다
import { useEffect } from "react";

/**
 * 회원가입 컴포넌트
 */
export default function RegisterMember() {
    // 입력된 회원 정보를 저장할 상태 변수
    const [member, setMember] = useState({
        user_id : "",
        user_name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        age: "",
    });
    const [email, setEmail] = useState("");
    const debouncedEmail = useDebounce(email, 500); // 500ms 디바운스 적용

    const [emailError, setEmailError] = useState(""); // 이메일 중복 메시지
    const navigate = useNavigate();

    // debounce된 이메일 값이 변경될 때마다 실행, 사용자가 입력할 때마다 실행되지 않고 500ms 후에 실행됩니다
    // 즉, 사용자가 입력을 멈추고 500ms 후에 실행됩니다
    useEffect(() => {
        if (debouncedEmail) {
            checkEmail(debouncedEmail);
        }
    }, [debouncedEmail]);

    // 입력 필드 변경 처리
    // const onMemberChange = (event) => {
    //     const { name, value } = event.target;
    //     setMember({ ...member, [name]: value });
    //
    //     if (name === "email") {
    //         checkEmail(value);
    //     }
    // };
    // 입력 필드 변경 처리
    const onMemberChange = (event) => {
        const { name, value } = event.target;
        setMember({ ...member, [name]: value }); // 입력 필드 값 업데이트
        if (name === "email") {
            setEmail(value); // 이 부분을 추가
        }
    };

    // 이메일 중복 체크
    const checkEmail = (email) => {
        fetch(`${API_URL}members/checkEmail?email=${email}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "duplicate") {
                    setEmailError(data.message);
                } else {
                    setEmailError("");
                }
            })
            .catch((error) => {
                console.error("이메일 중복 체크 중 오류 발생:", error);
                setEmailError("이메일 확인 중 오류가 발생했습니다.");
            });
    };

    // 회원가입 처리
    const handleOnSubmit = () => {
        fetch(API_URL + "members/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member),
        })
            .then((response) => {
                if (response.ok) {
                    alert("회원가입이 완료되었습니다.");
                    navigate("/login");
                } else {
                    return response.text().then((text) => {
                        alert("회원가입 실패: " + text);
                    });
                }
            })
            .catch((error) => console.error("회원가입 중 오류 발생:", error));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
            <Typography variant="h4" style={{ marginBottom: "20px", fontWeight: "bold" }}>
                회원가입
            </Typography>
            <TextField
                label="User_id"
                name="user_id"
                value={member.user_id}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
            />
            <TextField
                label="User_name"
                name="user_name"
                value={member.user_name}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
            />
            <TextField
                label="Email"
                name="email"
                value={member.email}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
                error={!!emailError} // 에러 여부 표시
                helperText={emailError} // 오류 메시지 표시
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={member.password}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
            />
            <TextField
                label="Phone"
                name="phone"
                value={member.phone}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
            />
            <TextField
                label="Address"
                name="address"
                value={member.address}
                onChange={onMemberChange}
                style={{ width: "400px", marginBottom: "10px" }}
            />
             <TextField
                 label="Age"
                 name="age"
                 value={member.age}
                 onChange={onMemberChange}
                 style={{ width: "400px", marginBottom: "10px" }}
             />
            <Button variant="contained" onClick={handleOnSubmit} disabled={!!emailError}>
                회원가입
            </Button>
        </div>
    );
}
