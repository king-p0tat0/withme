import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../common/fetchWithAuth"; // 인증된 fetch 함수
import { API_URL } from "../../constant"; // API 기본 URL
import { useSelector } from "react-redux";

/**
 * 전문가 신청 상태 조회(사용자)
 */
export default function DoctorApplicationStatus({user}) {
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // 로딩 상태 추가


    useEffect(() => {
        const fetchDoctorApplication = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}doctors/application/${user.id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setDoctor(data);
                } else if (response.status === 404) {
                    setError("현재 신청된 정보가 없습니다. 전문가 신청을 진행해주세요.");
                } else {
                    setError("서버 오류로 신청 정보를 불러오지 못했습니다.");
                }
            } catch (error) {
                setError("네트워크 오류로 신청 정보를 가져오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorApplication();
    }, []);

    // 상태값 한글 변환 함수
    const getStatusText = (status) => {
        switch (status) {
            case "APPROVED":
                return "승인됨";
            case "PENDING":
                return "심사 중";
            case "REJECTED":
                return "거절됨";
            case "ON_HOLD":
                return "보류 중";
            default:
                return status;
        }
    };

    // 로딩 화면
    if (loading) {
        return <div>⏳ 로딩 중...</div>;
    }

    // 오류 발생 시
    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <div>
            <h2>내 의사 신청 정보</h2>

            {/* 거절/보류 사유 출력 (사유가 있을 경우에만) */}
            {doctor.reason && (
                <p>
                    <strong>사유:</strong> {doctor.reason}
                </p>
            )}

            <p><strong>이름:</strong> {doctor.name}</p>
            <p><strong>병원명:</strong> {doctor.hospital}</p>
            <p><strong>전문분야:</strong> {doctor.subject}</p>
            <p><strong>신청 상태:</strong> {getStatusText(doctor.status)}</p>
        </div>
    );
}
