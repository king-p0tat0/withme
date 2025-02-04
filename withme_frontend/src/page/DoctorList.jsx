import React, { useState, useEffect } from 'react';
import '../css/DoctorList.css';
import DoctorView from './DoctorView';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { fetchWithAuth } from '../common/fetchWithAuth';




/**
 * 전문가 리스트 페이지
 * - 전문가 목록 출력
 *   전문가번호 / 이름 / 담당과목 / 병원정보 / 상태
 * - 전문가 검색
 *
 */


export default function DoctorList() {
    const [doctors, setDoctors] = useState([]); // 전문가 리스트 상태
        const [loading, setLoading] = useState(false); // 로딩 상태
        const [error, setError] = useState(null); // 에러 상태
        const [currentPage, setCurrentPage] = useState(1);
        const [searchQuery, setSearchQuery] = useState({
            name: '',
            subject: '',
            hospital: '',
            status: '',
        });
        const itemsPerPage = 10;

        // 전문가 리스트 가져오기
        const fetchDoctors = async () => {
            setLoading(true);
            setError(null);
            try {
                // JWT 토큰을 localStorage에서 가져와서 Authorization 헤더에 포함
                const token = localStorage.getItem("token");

                const response = await axios.get('http://localhost:8080/api/admin/doctor/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가
                        'Content-Type': 'application/json'
                    }
                });
                setDoctors(response.data); // 서버에서 받은 데이터로 상태 업데이트
            } catch (err) {
                setError('전문가 데이터를 가져오는 데 실패했습니다.'); // 오류 발생 시 오류 메시지 업데이트
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchDoctors(); // 컴포넌트 마운트 시 전문가 리스트 가져오기
        }, []);

        // 검색기능
        const filteredData = doctors.filter((doctor) => {
            return (
                doctor.user.userName.includes(searchQuery.name) &&
                doctor.subject.includes(searchQuery.subject) &&
                doctor.hospital.includes(searchQuery.hospital) &&
                (searchQuery.status === '' || doctor.status === searchQuery.status)
            );
        });

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);

        const currentData = filteredData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        const handlePageChange = (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
            }
        };

        const handleSearchChange = (e) => {
            const { name, value } = e.target;
            setSearchQuery((prev) => ({ ...prev, [name]: value }));
        };

//     상태값 한글 변환
    const getStatusText = (status) => {
        switch (status) {
            case 'APPROVED':
                return '승인';
            case 'PENDING':
                return '대기';
            case 'REJECTED':
                return '거절';
            case 'ON_HOLD':
                return '보류';
            default:
                return status;
        }
    };


    return (
        <div className="doctor-list-container">
            <h1 className="title">전문가 리스트</h1>

            {/* 🔍 검색창 */}
            <div className="search-bar">
                <input type="text" placeholder="이름 검색" name="name" value={searchQuery.name} onChange={handleSearchChange} />
                <input type="text" placeholder="담당과목 검색" name="subject" value={searchQuery.subject} onChange={handleSearchChange} />
                <input type="text" placeholder="병원정보 검색" name="hospital" value={searchQuery.hospital} onChange={handleSearchChange} />
                <select name="status" value={searchQuery.status} onChange={handleSearchChange}>
                    <option value="">상태 선택</option>
                    <option value="APPROVED">승인</option>
                    <option value="PENDING">대기</option>
                    <option value="REJECTED">거절</option>
                    <option value="ON_HOLD">보류</option>
                </select>
            </div>

            {/* ⏳ 데이터 로딩 상태 표시 */}
            {loading ? (
                <p className="loading">데이터를 불러오는 중...</p>
            ) : (
                <>
                    {/* 📋 전문가 테이블 */}
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>전문가번호</th>
                                <th>이름</th>
                                <th>담당과목</th>
                                <th>병원정보</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((doctor) => (
                                    <tr key={doctor.doctorId}>
                                        <td>{doctor.doctorId}</td>
                                        <td>{doctor.user.userName}</td>
                                        <td>{doctor.subject}</td>
                                        <td>{doctor.hospital}</td>
                                        <td>{getStatusText(doctor.status)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* 페이징 버튼 */}
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}