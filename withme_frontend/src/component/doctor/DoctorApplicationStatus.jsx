import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../common/fetchWithAuth"; // 인증된 fetch
import { API_URL } from "../../constant"; // API 기본 URL

/**
 * 전문가 신청 상태 조회(사용자)
 */
export default function DoctorApplicationStatus() {
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDoctorApplication = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}api/doctors/application`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setDoctor(data);
                } else {
                    setError("의사 신청 정보가 없습니다.");
                }
            } catch (error) {
                setError("신청 정보를 가져오는데 실패했습니다.");
            }
        };

        fetchDoctorApplication();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!doctor) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <h2>내 의사 신청 정보</h2>
            <p><strong>이름:</strong> {doctor.name}</p>
            <p><strong>병원명:</strong> {doctor.hospital}</p>
            <p><strong>전문분야:</strong> {doctor.subject}</p>
            <p><strong>상태:</strong> {doctor.status}</p>
            {/* 추가 정보 표시 */}
        </div>
    );
}
