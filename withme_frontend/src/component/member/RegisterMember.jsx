import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

/**
 * 회원가입 컴포넌트
 */
export default function RegisterMember() {
    const navigate = useNavigate();

    const [member, setMember] = useState({
        username: "",
        email: "",
        password: "",
        passwordre: "",
        phone: "",
        address: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 보이기 상태
    const [emailError, setEmailError] = useState(""); // 이메일 중복 메시지
    const [ageConfirmed, setAgeConfirmed] = useState(false); // 만 18세 이상 확인

    // 입력 필드 변경 처리
    const onMemberChange = (event) => {
        const { name, value } = event.target;
        setMember({ ...member, [name]: value });
    };

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleOnSubmit = (event) => {
        event.preventDefault();

        if (member.password !== member.passwordre) {
            alert("비밀번호가 다릅니다");
            return;
        }

        // 회원가입 완료 페이지로 이동
        navigate("/signupSuccess");
    };

    return (
        <div className="container">
            {/* 상단 단계 표시 */}
            <div className="description-container">
                <div className="description box">
                    <img src="assets/images/icon/file-check.png" alt="file-check" className="icon" />
                    <p>약관동의</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="box" />
                <div className="description box">
                    <img src="assets/images/icon/user-pen-color.png" alt="user-pen" className="icon" />
                    <p style={{ color: "#ff7c24" }}>회원정보 입력</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="box" />
                <div className="description">
                    <img src="assets/images/icon/thumbs-up.png" alt="thumbs-up" className="icon" />
                    <p>가입완료</p>
                </div>
            </div>

            {/* 회원가입 폼 */}
            <div className="form-wrap">
                <Typography variant="h4" style={{ marginBottom: "20px", fontWeight: "bold" }}>
                    회원가입
                </Typography>
                <form onSubmit={handleOnSubmit} className="register-form">
                    {/* 이름 입력 */}
                    <div className="input-group">
                        <TextField
                            label="이름"
                            name="username"
                            value={member.username}
                            onChange={onMemberChange}
                            fullWidth
                            required
                            placeholder="한글 2~8자 이내"
                        />
                    </div>

                    {/* 아이디 입력 */}
                    <div className="input-group">
                        <TextField
                            label="아이디"
                            name="id"
                            value={member.id}
                            onChange={onMemberChange}
                            fullWidth
                            required
                            placeholder="영문, 숫자 조합 6~12자 이내"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div className="input-group">
                        <TextField
                            label="비밀번호"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            value={member.password}
                            onChange={onMemberChange}
                            fullWidth
                            required
                            placeholder="영문, 숫자, 특수문자 조합 8~16자 이내"
                        />
                        <FontAwesomeIcon
                            icon={passwordVisible ? faEye : faEyeSlash}
                            onClick={togglePassword}
                            className="password-toggle-icon"
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="input-group">
                        <TextField
                            label="비밀번호 확인"
                            name="passwordre"
                            type="password"
                            value={member.passwordre}
                            onChange={onMemberChange}
                            fullWidth
                            required
                        />
                    </div>

                    {/* 이메일 입력 */}
                    <div className="input-group">
                        <TextField
                            label="이메일"
                            name="email"
                            type="email"
                            value={member.email}
                            onChange={onMemberChange}
                            fullWidth
                            required
                            placeholder="ex) withme@naver.com"
                            error={!!emailError}
                            helperText={emailError}
                        />
                    </div>

                    {/* 주소 입력 */}
                    <div className="input-group">
                        <TextField
                            label="주소"
                            name="address"
                            value={member.address}
                            onChange={onMemberChange}
                            fullWidth
                            required
                        />
                    </div>

                    {/* 전화번호 입력 */}
                    <div className="input-group">
                        <TextField
                            label="전화번호"
                            name="phone"
                            value={member.phone}
                            onChange={onMemberChange}
                            fullWidth
                            required
                            placeholder="ex) 010-1234-1234"
                        />
                    </div>

                    {/* 만 18세 이상 동의 체크박스 */}
                    <div className="input-group">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ageConfirmed}
                                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                                    required
                                />
                            }
                            label="만 18세 이상입니다. (필수)"
                        />
                    </div>

                    {/* 회원가입 버튼 */}
                    <Button type="submit" variant="contained" fullWidth disabled={emailError || !ageConfirmed}>
                        회원가입
                    </Button>
                </form>
            </div>
        </div>
    );
}
