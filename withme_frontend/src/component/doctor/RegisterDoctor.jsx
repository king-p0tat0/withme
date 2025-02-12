import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth"; // 인증된 API 호출 함수
import '../../css/RegisterDoctor.css';

export default function DoctorApplicationForm({ user }) { // user를 props로 받음
    // 사용자 정보 및 추가 입력 필드를 저장할 상태
    const [userData, setUserData] = useState({
        subject: "",
        hospital: "",
        doctorNumber: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * 입력 값 업데이트
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * 전문가 신청 제출 (사용자 정보 + 추가 입력 데이터)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.subject || !userData.hospital || !userData.doctorNumber) {
            setError("모든 필드를 입력해야 합니다.");
            return;
        }

        console.log("전문가 신청 페이지 호출 전 확인 - user.email : ", user.email);
        setLoading(true);
        try {
            const response = await fetchWithAuth(`${API_URL}doctors/apply/${user.email}`, {
                method: "POST",
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert("전문가 신청이 완료되었습니다.");
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || "신청에 실패했습니다.");
            }
        } catch (error) {
            console.error("신청 실패:", error);
            setError("신청에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="application-form-container">
            <Typography variant="h4" gutterBottom>전문가 신청</Typography>

            <form onSubmit={handleSubmit}>
                {/* 추가 입력 필드 (전문가 정보) */}
                <div className="form-group">
                    <TextField label="전문분야" name="subject" value={userData.subject} onChange={handleChange} fullWidth required />
                </div>
                <div className="form-group">
                    <TextField label="병원주소" name="hospital" value={userData.hospital} onChange={handleChange} fullWidth required />
                </div>
                <div className="form-group">
                    <TextField label="면허 번호" name="doctorNumber" value={userData.doctorNumber} onChange={handleChange} fullWidth required />
                </div>

                <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                    {loading ? "신청 중..." : "전문가 신청"}
                </Button>

                {error && <Typography color="error">{error}</Typography>}
            </form>
        </div>
    );
}
