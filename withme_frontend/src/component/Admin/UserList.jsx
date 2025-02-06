import React, { useState, useEffect } from 'react';
import '../../css/DoctorList.css';
import DoctorView from './DoctorView';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { fetchWithAuth } from '../../common/fetchWithAuth';
import { API_URL } from '../../constant';




export default function UserList() {
    const [users, setUsers] = useState([]); // 유저 리스트 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [currentPage, setCurrentPage] = useState(1);  // 현재 보여줄 페이지
    const [searchQuery, setSearchQuery] = useState({    // 검색 요소 상태
        userName: '',
        email: '',
        address: '',
        phone: '',
        role: '',
        points: '',
        createdAt: ''
    });
    const itemsPerPage = 10;

    // 유저 리스트 가져오기
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // JWT 토큰을 localStorage에서 가져와서 Authorization 헤더에 포함
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_URL}members/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가
                    'Content-Type': 'application/json'
                }
            });
            setUsers(response.data); // 서버에서 받은 데이터로 상태 업데이트
        } catch (err) {
            setError('사용자 데이터를 가져오는 데 실패했습니다.'); // 오류 발생 시 오류 메시지 업데이트
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // 컴포넌트 마운트 시 유저 리스트 가져오기
    }, []);

    const filteredData = users.filter((user) => {
        return (
            (user.userName ?? '').includes(searchQuery.userName) &&
            (user.email ?? '').includes(searchQuery.email) &&
            (user.address ?? '').includes(searchQuery.address) &&
            (user.phone ?? '').includes(searchQuery.phone) &&
            (user.role ?? '').includes(searchQuery.role) &&
            (user.points ?? '').toString().includes(searchQuery.points) &&
            (user.createdAt ?? '').includes(searchQuery.createdAt)
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
            <h1 className="title">사용자 리스트</h1>


            {loading ? (
                <p className="loading">데이터를 불러오는 중...</p>
            ) : (
                <>
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>이메일</th>
                                <th>주소</th>
                                <th>전화번호</th>
                                <th>권한</th>
                                <th>포인트</th>
                                <th>가입일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.role}</td>
                                        <td>{user.points}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
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