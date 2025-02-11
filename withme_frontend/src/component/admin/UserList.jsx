import React, { useState, useEffect } from 'react';
import '../../css/DoctorList.css';
import { API_URL } from '../../constant';
import { fetchWithAuth } from '../../common/fetchWithAuth'; // fetchWithAuth import

export default function UserList() {
    const [users, setUsers] = useState([]);  // 전체 유저 리스트 상태
    const [loading, setLoading] = useState(false);  // 로딩 상태
    const [error, setError] = useState(null);  // 에러 상태
    const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 (백엔드 기준 0부터 시작)
    const [totalPages, setTotalPages] = useState(1);  // 전체 페이지 수
    const [searchQuery, setSearchQuery] = useState({  // 검색 요소 상태
        name: '',
        email: '',
        phone: '',
        role: ''
    });

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    // ✅ 검색어 디바운스 처리
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); // 500ms 후에 변경된 검색어로 API 호출

        return () => clearTimeout(timer); // 타이머 정리
    }, [searchQuery]);

    // ✅ 유저 리스트 가져오기 (페이징 적용 및 검색 조건 포함)
    const fetchUsers = async (page = 0, size = 10, query = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`${API_URL}members/list`, {
                method: 'GET',
                params: {
                    page,
                    size,
                    ...query
                }
            });
        console.log("받아온 response : ", response);
        const data = await response.json();
        console.log("받아온 data : ", data);


            if (data) {
                setUsers(data);
            } else {
                setUsers([]);
                setTotalPages(1);
            }
        } catch (err) {
            setError('사용자 데이터를 가져오는 데 실패했습니다.');
            console.error("API 요청 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    // ✅ 컴포넌트 마운트 및 페이지 변경 시 데이터 가져오기
    useEffect(() => {
        fetchUsers(currentPage, 10, debouncedSearchQuery);  // 디바운스된 검색어로 데이터 가져오기
    }, [currentPage, debouncedSearchQuery]);  // currentPage와 debouncedSearchQuery가 변경될 때마다 호출

    // ✅ 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="doctor-list-container">
            <h1 className="title">사용자 리스트</h1>

            {/* ✅ 검색 입력창 */}
            <div className="search-container">
                <input
                    type="text"
                    name="name"
                    placeholder="이름 검색"
                    value={searchQuery.name}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="이메일 검색"
                    value={searchQuery.email}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="전화번호 검색"
                    value={searchQuery.phone}
                    onChange={handleSearchChange}
                />
                <input
                    type="text"
                    name="role"
                    placeholder="권한 검색"
                    value={searchQuery.role}
                    onChange={handleSearchChange}
                />
            </div>

            {/* 로딩 상태 처리 */}
            {loading ? (
                <p className="loading">데이터를 불러오는 중...</p>
            ) : (
                <>
                    <table className="doctor-table">
                        <thead>
                            <tr>
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
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.role}</td>
                                        <td>{user.points}</td>
                                        <td>{new Date(user.regTime).toLocaleDateString('ko-KR')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* 페이징 버튼 */}
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={currentPage === index ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
