import React, { useState, useEffect } from 'react';
import '../css/DoctorList.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * 전문가 리스트 페이지
 * - 전문가 목록 출력
 *   전문가번호 / 이름 / 담당과목 / 병원정보 / 상태
 * - 전문가 검색
 *
 */

export default function DoctorList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        subject: '',
        hospital: '',
        status: '',
    });
    const [doctors, setDoctors] = useState([]);  // 실제 데이터를 저장할 상태
    const itemsPerPage = 10;    // 페이지단위 보여줄 리스트 수

    // API 호출하여 데이터를 가져오기
    useEffect(() => {
        // 사용자 ID는 실제로 어떻게 받아올지에 따라 다릅니다.
        const userId = '사용자ID';  // 예시: 로그인된 사용자 ID 가져오기

        // API 호출
        axios
            .get(`/api/doctorApplications/${userId}`) // 여기에 실제 API 경로 넣기
            .then((response) => {
                setDoctors(response.data); // 받은 데이터를 상태에 저장
            })
            .catch((error) => {
                console.error('데이터를 가져오는 데 실패했습니다.', error);
            });
    }, []); // 컴포넌트가 처음 렌더링될 때만 호출됨

    // 검색기능
    const filteredData = doctors.filter((doctor) => {
        return (
            doctor.name.includes(searchQuery.name) &&   // 이름검색
            doctor.subject.includes(searchQuery.subject) && // 담당과목검색
            doctor.hospital.includes(searchQuery.hospital) && // 병원정보검색
            (searchQuery.status === '' || doctor.status === searchQuery.status) // 상태검색
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage); // 전체 페이지 수

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

    return (
        <div className="doctor-list-container">
            <h1 className="title">전문가 리스트</h1>

            {/* 검색창 */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="이름 검색"
                    className="search-input"
                    name="name"
                    value={searchQuery.name}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    placeholder="담당과목 검색"
                    className="search-input"
                    name="subject"
                    value={searchQuery.subject}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    placeholder="병원정보 검색"
                    className="search-input"
                    name="hospital"
                    value={searchQuery.hospital}
                    onChange={handleSearchChange}
                />
                <select
                    className="search-select"
                    name="status"
                    value={searchQuery.status}
                    onChange={handleSearchChange}
                >
                    <option value="">상태 선택</option>
                    <option value="승인">승인</option>
                    <option value="대기">대기</option>
                    <option value="거절">거절</option>
                    <option value="보류">보류</option>
                </select>
                <button className="search-button" onClick={() => setCurrentPage(1)}>검색</button>
            </div>

            {/* 전문가 테이블 */}
            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>전문가번호</th>
                        <th>이름</th>
                        <th>담당과목</th>
                        <th>병원정보</th>
                        <th>상태</th>
                        <th>상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.subject}</td>
                            <td>{doctor.hospital}</td>
                            <td>{doctor.status}</td>
                            <td><button className="detail-button">보기</button></td>
                        </tr>
                    ))}
                    {currentData.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                검색 결과가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이징 */}
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
}
