import React, { useState, useEffect } from 'react';
import '../css/DoctorList.css';

/**
 * 전문가 리스트 페이지
 * - 전문가 목록 출력
 *   전문가번호 / 이름 / 담당과목 / 병원정보 / 상태
 * - 전문가 검색
 *
 */

const mockData = [
    { id: 1, name: '이상훈', subject: '피부과', hospital: '서울병원', status: '승인' },
    { id: 2, name: '김철수', subject: '내과', hospital: '강남병원', status: '승인' },
    { id: 3, name: '박영희', subject: '소아과', hospital: '한강병원', status: '대기' },
    { id: 4, name: '정민호', subject: '정형외과', hospital: '서울병원', status: '승인' },
    { id: 5, name: '최지우', subject: '치과', hospital: '강북병원', status: '대기' },
    { id: 6, name: '한예슬', subject: '한방과', hospital: '용산병원', status: '승인' },
    { id: 7, name: '조승우', subject: '비뇨기과', hospital: '종로병원', status: '승인' },
    { id: 8, name: '신동엽', subject: '정신과', hospital: '강남병원', status: '거절' },
    { id: 9, name: '이영자', subject: '소아과', hospital: '서초병원', status: '승인' },
    { id: 10, name: '유재석', subject: '내과', hospital: '서울병원', status: '대기' },
    { id: 11, name: '강호동', subject: '피부과', hospital: '강남병원', status: '승인' },
    { id: 12, name: '송은이', subject: '정형외과', hospital: '한강병원', status: '보류' },
];

export default function DoctorList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        subject: '',
        hospital: '',
        status: '',
    });
    const itemsPerPage = 10;

    const filteredData = mockData.filter((doctor) => {
        return (
            doctor.name.includes(searchQuery.name) &&
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