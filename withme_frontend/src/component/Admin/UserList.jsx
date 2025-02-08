import React, { useState, useEffect } from 'react';
import '../../css/DoctorList.css';
import axios from "axios";
import { API_URL } from '../../constant';

export default function UserList() {
    const [users, setUsers] = useState([]); // 사용자 리스트 상태
   const [loading, setLoading] = useState(false); // 로딩 상태
   const [error, setError] = useState(null); // 에러 상태
   const [currentPage, setCurrentPage] = useState(1);
   const [searchQuery, setSearchQuery] = useState({
       name: '',
       email: '',
       phone: '',
       address: '',
       role: ''
   });
   const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
   const itemsPerPage = 10;
   // 모달 상태
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);

   // 전문가 리스트 가져오기
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
            console.log(response.data);
           setUsers(response.data); // 서버에서 받은 데이터로 상태 업데이트
       } catch (err) {
           setError('데이터를 가져오는 데 실패했습니다.'); // 오류 발생 시 오류 메시지 업데이트
       } finally {
           setLoading(false);
       }
   };

   useEffect(() => {
       fetchUsers(); // 컴포넌트 마운트 시 전문가 리스트 가져오기
   }, []);

   // 검색딜레이 - 입력이 멈추면 검색
   useEffect(() => {
       const timer = setTimeout(() => {
           setDebouncedQuery(searchQuery);
       }, 500);

   return () => clearTimeout(timer); // 기존 타이머 제거 (연속 입력 시 딜레이 유지)
}, [searchQuery]);

   // 검색기능
   const filteredData = users.filter((user) => {
       return (
           user.name.includes(debouncedQuery.name) &&
           user.email.includes(debouncedQuery.email) &&
           user.phone.includes(debouncedQuery.phone) &&
           user.address.includes(debouncedQuery.address) &&
           (debouncedQuery.role === '' || user.role === debouncedQuery.role)
       );
   });

   // debouncedQuery 값이 변경될 때만 API 호출
   useEffect(() => {
       if (debouncedQuery.keyword) {
           fetchData(debouncedQuery);
       }
   }, [debouncedQuery]);

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


   // 팝업 열기 함수
   const openModal = (doctor) => {
       setSelectedDoctor(doctor);
       setIsModalOpen(true);
   };

   // 팝업 닫기 함수
   const closeModal = () => {
       setIsModalOpen(false);
   };

   return (
       <div className="doctor-list-container">
           <h1 className="title">사용자 리스트</h1>

           {/* 검색창 */}
           <div className="search-bar">
               <input type="text" placeholder="이름 검색" name="name" value={searchQuery.name} onChange={handleSearchChange} />
               <input type="text" placeholder="이메일 검색" name="email" value={searchQuery.email} onChange={handleSearchChange} />
               <input type="text" placeholder="전화번호 검색" name="phone" value={searchQuery.phone} onChange={handleSearchChange} />
               <select name="role" value={searchQuery.role} onChange={handleSearchChange}>
                   <option value="">권한 선택</option>
                   <option value="USER">일반회원</option>
                   <option value="DOCTOR">전문가</option>
                   <option value="ADMIN">관리자</option>
                   <option value="VIP">구독회원</option>
               </select>
           </div>
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
                               <th>연락처</th>
                               <th>권한</th>
                               <th>상세보기</th>
                           </tr>
                       </thead>
                       <tbody>
                           {currentData.length > 0 ? (
                               currentData.map((user) => (
                                   <tr key={user.userId}>
                                       <td>{user.name}</td>
                                       <td>{user.email}</td>
                                       <td>{user.address}</td>
                                       <td>{user.phone}</td>
                                       <td>{user.role}</td>
                                       <td>
                                           <button onClick={() => openModal(user)}>상세보기</button>
                                       </td>
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

                   {/* 팝업 모달 */}
                   {isModalOpen && (
                       <DoctorView doctor={selectedUser} onClose={closeModal} docList={fetchUsers} />
                   )}

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
