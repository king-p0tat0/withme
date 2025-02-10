import { Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth"; // 인증된 API 호출 함수
import '../../css/RegisterDoctor.css';

export default function DoctorApplicationForm() {
    // Redux에서 사용자 정보 가져오기
    const { user } = useSelector((state) => state.auth);

    // 사용자 정보 및 추가 입력 필드를 저장할 상태
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        subject: "",
        hospital: "",
        doctorNumber: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * 컴포넌트가 렌더링될 때 사용자 정보 불러오기
     */
    useEffect(() => {
        if (user) {
            fetchMemberData(user.id);
        }
    }, [user]);

    /**
     * 사용자 정보 API 호출
     */
    const fetchMemberData = async (memberId) => {
        try {
            const response = await fetchWithAuth(`${API_URL}members/${memberId}`, { method: "GET" });

            if (response.ok) {
                const result = await response.json();
                const userData = result.data;

                setUserData((prevData) => ({
                    ...prevData,
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                }));
            } else {
                console.error("사용자 정보 로드 실패:", response.status);
                alert("사용자 정보를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("사용자 정보 로드 중 오류 발생:", error.message);
            alert("사용자 정보 로드 실패: 네트워크 또는 서버 오류");
        }
    };

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

        setLoading(true);
        try {
            const response = await fetchWithAuth(`${API_URL}doctors/apply`, {
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
                {/* 사용자 정보 */}
                <div className="form-group">
                    <TextField label="이름" name="name" value={userData.name} disabled fullWidth />
                </div>
                <div className="form-group">
                    <TextField label="이메일" name="email" value={userData.email} disabled fullWidth />
                </div>
                <div className="form-group">
                    <TextField label="전화번호" name="phone" value={userData.phone} onChange={handleChange} fullWidth />
                </div>
                <div className="form-group">
                    <TextField label="주소" name="address" value={userData.address} onChange={handleChange} fullWidth />
                </div>

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
