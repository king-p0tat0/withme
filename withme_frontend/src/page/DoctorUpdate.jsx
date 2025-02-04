import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from '../common/fetchWithAuth';

export default function DoctorUpdate() {
    const [pendingDoctors, setPendingDoctors] = useState([]); // 대기중 전문가 리스트 상태

    // DB에서 리스트 가져오기
    const fetchPendingDoctors = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get('http://localhost:8080/api/admin/doctor/pending', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가
                    'Content-Type': 'application/json'
                }
            });
            setPendingDoctors(response.data); // 서버에서 받은 데이터로 상태 업데이트
        } catch (err) {
            console.error('신청 리스트를 가져오는 데 실패', err);
        }
    }

    useEffect(() => {
        fetchPendingDoctors(); // 전문가 리스트 가져오기
    }, []);

/* 승인 버튼 이벤트
  - 승인 버튼을 누르면 해당 전문가의 userId를 보내서 approveDoctorApplication 함수 실행
 */
    const handleApprove = async (userId) => {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/admin/doctor/approve/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                fetchPendingDoctors(); // 전문가 리스트 가져오기
            } else {
                console.error('승인 실패', response.status);
            }
        } catch (error) {
            console.error('승인 실패', error);
        }
    };

    return (
        <div>
            <h1>대기중 전문가 목록</h1>
            <table>
                <thead>
                    <tr>
                        <th>전문가번호</th>
                        <th>이름</th>
                        <th>담당과목</th>
                        <th>병원정보</th>
                        <th>상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingDoctors.length > 0 ?(
                        pendingDoctors.map((doctor) => (
                        <tr key={doctor.doctorId}>
                            <td>{doctor.doctorId}</td>
                            <td>{doctor.user.userName}</td>
                            <td>{doctor.subject}</td>
                            <td>{doctor.hospital}</td>
                            <td><button onClick={() => handleApprove(doctor.user.userId)}>승인</button></td>
                        </tr>
                    ))
                    ):(
                        <tr>
                            <td colSpan="5">신청자가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}