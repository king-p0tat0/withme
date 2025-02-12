import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../common/fetchWithAuth"; // 인증된 fetch
import { API_URL } from "../../constant"; // API 기본 URL

/**
 * 전문가 신청 정보 수정 페이지
 */
export default function DoctorApplicationEdit() {
    const [doctorData, setDoctorData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        hospital: "",
        doctorNumber: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}api/doctors/application`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setDoctorData(data);
                } else {
                    setError("의사 신청 정보를 불러올 수 없습니다.");
                }
            } catch (error) {
                setError("정보를 불러오는데 실패했습니다.");
            }
        };

        fetchDoctorData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetchWithAuth(`${API_URL}api/doctors/application`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(doctorData),
            });

            if (response.ok) {
                alert("신청 정보가 수정되었습니다.");
            } else {
                setError("수정에 실패했습니다.");
            }
        } catch (error) {
            setError("수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>의사 신청 수정</h2>
            <form onSubmit={handleSubmit}>
                {/* 신청 수정 폼 구현 */}
                <button type="submit" disabled={loading}>
                    {loading ? "수정 중..." : "수정 제출"}
                </button>
            </form>
        </div>
    );
}
