[1mdiff --git a/withme_frontend/src/component/Admin/DoctorList.jsx b/withme_frontend/src/component/Admin/DoctorList.jsx[m
[1mindex 6b32170a..a21dfe83 100644[m
[1m--- a/withme_frontend/src/component/Admin/DoctorList.jsx[m
[1m+++ b/withme_frontend/src/component/Admin/DoctorList.jsx[m
[36m@@ -1,14 +1,10 @@[m
 import React, { useState, useEffect } from 'react';[m
 import '../../css/DoctorList.css';[m
[31m-import DoctorView from './Modal/DoctorView';[m
[32m+[m[32mimport DoctorView from './DoctorView';[m
 import { useNavigate, Link } from 'react-router-dom';[m
[31m-import axios from "axios";[m
[31m-import { fetchWithAuth } from '../../common/fetchWithAuth';[m
[32m+[m[32mimport { fetchWithAuth } from '../../common/fetchWithAuth'; // fetchWithAuth import[m
 import { API_URL } from '../../constant';[m
 [m
[31m-[m
[31m-[m
[31m-[m
 /**[m
  * 전문가 리스트 페이지[m
  * - 전문가 목록 출력[m
[36m@@ -17,7 +13,6 @@[m [mimport { API_URL } from '../../constant';[m
  *[m
  */[m
 [m
[31m-[m
 export default function DoctorList() {[m
     const [doctors, setDoctors] = useState([]); // 전문가 리스트 상태[m
     const [loading, setLoading] = useState(false); // 로딩 상태[m
[36m@@ -40,16 +35,12 @@[m [mexport default function DoctorList() {[m
         setLoading(true);[m
         setError(null);[m
         try {[m
[31m-            // JWT 토큰을 localStorage에서 가져와서 Authorization 헤더에 포함[m
[31m-            const token = localStorage.getItem("token");[m
[31m-[m
[31m-            const response = await axios.get(`${API_URL}admin/doctor/list`, {[m
[31m-                headers: {[m
[31m-                    Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가[m
[31m-                    'Content-Type': 'application/json'[m
[31m-                }[m
[31m-            });[m
[31m-            setDoctors(response.data); // 서버에서 받은 데이터로 상태 업데이트[m
[32m+[m[32m            // 데이터 가져오기[m
[32m+[m[32m            console.log("전문가 리스트 가져오기");[m
[32m+[m[32m            const response = await fetchWithAuth(`${API_URL}admin/doctor/list`);[m
[32m+[m[32m            console.log("전문가 response 확인 : ", response);[m
[32m+[m[32m            const data = await response.json();[m
[32m+[m[32m            setDoctors(data); // 서버에서 받은 데이터로 상태 업데이트[m
         } catch (err) {[m
             setError('전문가 데이터를 가져오는 데 실패했습니다.'); // 오류 발생 시 오류 메시지 업데이트[m
         } finally {[m
[36m@@ -67,8 +58,8 @@[m [mexport default function DoctorList() {[m
             setDebouncedQuery(searchQuery);[m
         }, 500);[m
 [m
[31m-    return () => clearTimeout(timer); // 기존 타이머 제거 (연속 입력 시 딜레이 유지)[m
[31m-}, [searchQuery]);[m
[32m+[m[32m        return () => clearTimeout(timer); // 기존 타이머 제거 (연속 입력 시 딜레이 유지)[m
[32m+[m[32m    }, [searchQuery]);[m
 [m
     // 검색기능[m
     const filteredData = doctors.filter((doctor) => {[m
[36m@@ -80,13 +71,6 @@[m [mexport default function DoctorList() {[m
         );[m
     });[m
 [m
[31m-    // debouncedQuery 값이 변경될 때만 API 호출[m
[31m-    useEffect(() => {[m
[31m-        if (debouncedQuery.keyword) {[m
[31m-            fetchData(debouncedQuery);[m
[31m-        }[m
[31m-    }, [debouncedQuery]);[m
[31m-[m
     const totalPages = Math.ceil(filteredData.length / itemsPerPage);[m
 [m
     const currentData = filteredData.slice([m
[36m@@ -105,7 +89,7 @@[m [mexport default function DoctorList() {[m
         setSearchQuery((prev) => ({ ...prev, [name]: value }));[m
     };[m
 [m
[31m-//     상태값 한글 변환[m
[32m+[m[32m    // 상태값 한글 변환[m
     const getStatusText = (status) => {[m
         switch (status) {[m
             case 'APPROVED':[m
[36m@@ -211,4 +195,4 @@[m [mexport default function DoctorList() {[m
             )}[m
         </div>[m
     );[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m}[m
[1mdiff --git a/withme_frontend/src/component/Admin/DoctorUpdate.jsx b/withme_frontend/src/component/Admin/DoctorUpdate.jsx[m
[1mindex 9277e775..20eb6073 100644[m
[1m--- a/withme_frontend/src/component/Admin/DoctorUpdate.jsx[m
[1m+++ b/withme_frontend/src/component/Admin/DoctorUpdate.jsx[m
[36m@@ -1,8 +1,6 @@[m
 import React, { useState, useEffect } from 'react';[m
[31m-import axios from "axios";[m
[31m-import { useNavigate } from "react-router-dom";[m
 import { fetchWithAuth } from '../../common/fetchWithAuth';[m
[31m-import DoctorViewAdmin from './Modal/DoctorViewAdmin';[m
[32m+[m[32mimport DoctorViewAdmin from './DoctorViewAdmin';[m
 import '../../css/DoctorUpdate.css';[m
 [m
 export default function DoctorUpdate() {[m
[36m@@ -13,26 +11,18 @@[m [mexport default function DoctorUpdate() {[m
     // DB에서 리스트 가져오기[m
     const fetchPendingDoctors = async () => {[m
         try {[m
[31m-            const token = localStorage.getItem("token");[m
[31m-[m
[31m-            const response = await axios.get('http://localhost:8080/api/admin/doctor/pending', {[m
[31m-                headers: {[m
[31m-                    Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가[m
[31m-                    'Content-Type': 'application/json'[m
[31m-                }[m
[31m-            });[m
[31m-            setPendingDoctors(response.data); // 서버에서 받은 데이터로 상태 업데이트[m
[32m+[m[32m            const response = await fetchWithAuth('http://localhost:8080/api/admin/doctor/pending');[m
[32m+[m[32m            const data = await response.json();[m
[32m+[m[32m            setPendingDoctors(data); // 서버에서 받은 데이터로 상태 업데이트[m
         } catch (err) {[m
             console.error('신청 리스트를 가져오는 데 실패', err);[m
         }[m
[31m-    }[m
[32m+[m[32m    };[m
 [m
     useEffect(() => {[m
         fetchPendingDoctors(); // 전문가 리스트 가져오기[m
     }, []);[m
 [m
[31m-[m
[31m-[m
     // 팝업 열기 함수[m
     const openModal = (doctor) => {[m
         setSelectedDoctor(doctor);[m
[36m@@ -44,7 +34,7 @@[m [mexport default function DoctorUpdate() {[m
         setIsModalOpen(false);[m
     };[m
 [m
[31m-//     상태값 한글 변환[m
[32m+[m[32m    // 상태값 한글 변환[m
     const getStatusText = (status) => {[m
         switch (status) {[m
             case 'APPROVED':[m
[36m@@ -75,21 +65,22 @@[m [mexport default function DoctorUpdate() {[m
                     </tr>[m
                 </thead>[m
                 <tbody>[m
[31m-                    {pendingDoctors.length > 0 ?([m
[32m+[m[32m                    {pendingDoctors.length > 0 ? ([m
                         pendingDoctors.map((doctor) => ([m
[31m-                        <tr key={doctor.doctorId}>[m
[31m-                            <td>{doctor.doctorId}</td>[m
[31m-                            <td>{doctor.member.name}</td>[m
[31m-                            <td>{doctor.subject}</td>[m
[31m-                            <td>{doctor.hospital}</td>[m
[31m-                            <td>{getStatusText(doctor.status)}</td>[m
[31m-                            <td><button className="detail-button" onClick={() => openModal(doctor)}>상세보기</button></td>[m
[31m-[m
[31m-                        </tr>[m
[31m-                    ))[m
[31m-                    ):([m
[32m+[m[32m                            <tr key={doctor.doctorId}>[m
[32m+[m[32m                                <td>{doctor.doctorId}</td>[m
[32m+[m[32m                                <td>{doctor.member.name}</td>[m
[32m+[m[32m                                <td>{doctor.subject}</td>[m
[32m+[m[32m                                <td>{doctor.hospital}</td>[m
[32m+[m[32m                                <td>{getStatusText(doctor.status)}</td>[m
[32m+[m[32m                                <td>[m
[32m+[m[32m                                    <button className="detail-button" onClick={() => openModal(doctor)}>상세보기</button>[m
[32m+[m[32m                                </td>[m
[32m+[m[32m                            </tr>[m
[32m+[m[32m                        ))[m
[32m+[m[32m                    ) : ([m
                         <tr>[m
[31m-                            <td colSpan="5" className="no-data">신청자가 없습니다.</td>[m
[32m+[m[32m                            <td colSpan="6" className="no-data">신청자가 없습니다.</td>[m
                         </tr>[m
                     )}[m
                 </tbody>[m
[36m@@ -101,4 +92,4 @@[m [mexport default function DoctorUpdate() {[m
             )}[m
         </div>[m
     );[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m}[m
[1mdiff --git a/withme_frontend/src/component/Admin/UserList.jsx b/withme_frontend/src/component/Admin/UserList.jsx[m
[1mindex 50fa9068..d622c845 100644[m
[1m--- a/withme_frontend/src/component/Admin/UserList.jsx[m
[1m+++ b/withme_frontend/src/component/Admin/UserList.jsx[m
[36m@@ -1,187 +1,179 @@[m
 import React, { useState, useEffect } from 'react';[m
 import '../../css/DoctorList.css';[m
[31m-import axios from "axios";[m
 import { API_URL } from '../../constant';[m
[32m+[m[32mimport { fetchWithAuth } from '../../common/fetchWithAuth'; // fetchWithAuth import[m
 [m
 export default function UserList() {[m
[31m-    const [users, setUsers] = useState([]); // 사용자 리스트 상태[m
[31m-   const [loading, setLoading] = useState(false); // 로딩 상태[m
[31m-   const [error, setError] = useState(null); // 에러 상태[m
[31m-   const [currentPage, setCurrentPage] = useState(1);[m
[31m-   const [searchQuery, setSearchQuery] = useState({[m
[31m-       name: '',[m
[31m-       email: '',[m
[31m-       phone: '',[m
[31m-       address: '',[m
[31m-       role: ''[m
[31m-   });[m
[31m-   const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);[m
[31m-   const itemsPerPage = 10;[m
[31m-   // 모달 상태[m
[31m-   const [isModalOpen, setIsModalOpen] = useState(false);[m
[31m-   const [selectedUser, setSelectedUser] = useState(null);[m
[31m-[m
[31m-   // 전문가 리스트 가져오기[m
[31m-   const fetchUsers = async () => {[m
[31m-       setLoading(true);[m
[31m-       setError(null);[m
[31m-       try {[m
[31m-           // JWT 토큰을 localStorage에서 가져와서 Authorization 헤더에 포함[m
[31m-           const token = localStorage.getItem("token");[m
[31m-[m
[31m-           const response = await axios.get(`${API_URL}members/list`, {[m
[31m-               headers: {[m
[31m-                   Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가[m
[31m-                   'Content-Type': 'application/json'[m
[31m-               }[m
[31m-           });[m
[31m-            console.log(response.data);[m
[31m-           setUsers(response.data); // 서버에서 받은 데이터로 상태 업데이트[m
[31m-       } catch (err) {[m
[31m-           setError('데이터를 가져오는 데 실패했습니다.'); // 오류 발생 시 오류 메시지 업데이트[m
[31m-       } finally {[m
[31m-           setLoading(false);[m
[31m-       }[m
[31m-   };[m
[31m-[m
[31m-   useEffect(() => {[m
[31m-       fetchUsers(); // 컴포넌트 마운트 시 전문가 리스트 가져오기[m
[31m-   }, []);[m
[31m-[m
[31m-   // 검색딜레이 - 입력이 멈추면 검색[m
[31m-   useEffect(() => {[m
[31m-       const timer = setTimeout(() => {[m
[31m-           setDebouncedQuery(searchQuery);[m
[31m-       }, 500);[m
[31m-[m
[31m-   return () => clearTimeout(timer); // 기존 타이머 제거 (연속 입력 시 딜레이 유지)[m
[31m-}, [searchQuery]);[m
[31m-[m
[31m-   // 검색기능[m
[31m-   const filteredData = users.filter((user) => {[m
[31m-       return ([m
[31m-           user.name.includes(debouncedQuery.name) &&[m
[31m-           user.email.includes(debouncedQuery.email) &&[m
[31m-           user.phone.includes(debouncedQuery.phone) &&[m
[31m-           user.address.includes(debouncedQuery.address) &&[m
[31m-           (debouncedQuery.role === '' || user.role === debouncedQuery.role)[m
[31m-       );[m
[31m-   });[m
[31m-[m
[31m-   // debouncedQuery 값이 변경될 때만 API 호출[m
[31m-   useEffect(() => {[m
[31m-       if (debouncedQuery.keyword) {[m
[31m-           fetchData(debouncedQuery);[m
[31m-       }[m
[31m-   }, [debouncedQuery]);[m
[31m-[m
[31m-   const totalPages = Math.ceil(filteredData.length / itemsPerPage);[m
[31m-[m
[31m-   const currentData = filteredData.slice([m
[31m-       (currentPage - 1) * itemsPerPage,[m
[31m-       currentPage * itemsPerPage[m
[31m-   );[m
[31m-[m
[31m-   const handlePageChange = (page) => {[m
[31m-       if (page >= 1 && page <= totalPages) {[m
[31m-           setCurrentPage(page);[m
[31m-       }[m
[31m-   };[m
[31m-[m
[31m-   const handleSearchChange = (e) => {[m
[31m-       const { name, value } = e.target;[m
[31m-       setSearchQuery((prev) => ({ ...prev, [name]: value }));[m
[31m-   };[m
[31m-[m
[31m-[m
[31m-   // 팝업 열기 함수[m
[31m-   const openModal = (doctor) => {[m
[31m-       setSelectedDoctor(doctor);[m
[31m-       setIsModalOpen(true);[m
[31m-   };[m
[31m-[m
[31m-   // 팝업 닫기 함수[m
[31m-   const closeModal = () => {[m
[31m-       setIsModalOpen(false);[m
[31m-   };[m
[31m-[m
[31m-   return ([m
[31m-       <div className="doctor-list-container">[m
[31m-           <h1 className="title">사용자 리스트</h1>[m
[31m-[m
[31m-           {/* 검색창 */}[m
[31m-           <div className="search-bar">[m
[31m-               <input type="text" placeholder="이름 검색" name="name" value={searchQuery.name} onChange={handleSearchChange} />[m
[31m-               <input type="text" placeholder="이메일 검색" name="email" value={searchQuery.email} onChange={handleSearchChange} />[m
[31m-               <input type="text" placeholder="전화번호 검색" name="phone" value={searchQuery.phone} onChange={handleSearchChange} />[m
[31m-               <select name="role" value={searchQuery.role} onChange={handleSearchChange}>[m
[31m-                   <option value="">권한 선택</option>[m
[31m-                   <option value="USER">일반회원</option>[m
[31m-                   <option value="DOCTOR">전문가</option>[m
[31m-                   <option value="ADMIN">관리자</option>[m
[31m-                   <option value="VIP">구독회원</option>[m
[31m-               </select>[m
[31m-           </div>[m
[31m-           {loading ? ([m
[31m-               <p className="loading">데이터를 불러오는 중...</p>[m
[31m-           ) : ([m
[31m-               <>[m
[31m-                   <table className="doctor-table">[m
[31m-                       <thead>[m
[31m-                           <tr>[m
[31m-                               <th>이름</th>[m
[31m-                               <th>이메일</th>[m
[31m-                               <th>주소</th>[m
[31m-                               <th>연락처</th>[m
[31m-                               <th>권한</th>[m
[31m-                               <th>상세보기</th>[m
[31m-                           </tr>[m
[31m-                       </thead>[m
[31m-                       <tbody>[m
[31m-                           {currentData.length > 0 ? ([m
[31m-                               currentData.map((user) => ([m
[31m-                                   <tr key={user.userId}>[m
[31m-                                       <td>{user.name}</td>[m
[31m-                                       <td>{user.email}</td>[m
[31m-                                       <td>{user.address}</td>[m
[31m-                                       <td>{user.phone}</td>[m
[31m-                                       <td>{user.role}</td>[m
[31m-                                       <td>[m
[31m-                                           <button onClick={() => openModal(user)}>상세보기</button>[m
[31m-                                       </td>[m
[31m-                                   </tr>[m
[31m-                               ))[m
[31m-                           ) : ([m
[31m-                               <tr>[m
[31m-                                   <td colSpan="5" style={{ textAlign: 'center' }}>[m
[31m-                                       검색 결과가 없습니다.[m
[31m-                                   </td>[m
[31m-                               </tr>[m
[31m-                           )}[m
[31m-                       </tbody>[m
[31m-                   </table>[m
[31m-[m
[31m-                   {/* 팝업 모달 */}[m
[31m-                   {isModalOpen && ([m
[31m-                       <DoctorView doctor={selectedUser} onClose={closeModal} docList={fetchUsers} />[m
[31m-                   )}[m
[31m-[m
[31m-                   {/* 페이징 버튼 */}[m
[31m-                   <div className="pagination">[m
[31m-                       <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>[m
[31m-                           이전[m
[31m-                       </button>[m
[31m-                       {Array.from({ length: totalPages }, (_, index) => ([m
[31m-                           <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>[m
[31m-                               {index + 1}[m
[31m-                           </button>[m
[31m-                       ))}[m
[31m-                       <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>[m
[31m-                           다음[m
[31m-                       </button>[m
[31m-                   </div>[m
[31m-               </>[m
[31m-           )}[m
[31m-       </div>[m
[31m-   );[m
[32m+[m[32m    const [users, setUsers] = useState([]);  // 전체 유저 리스트 상태[m
[32m+[m[32m    const [loading, setLoading] = useState(false);  // 로딩 상태[m
[32m+[m[32m    const [error, setError] = useState(null);  // 에러 상태[m
[32m+[m[32m    const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 (백엔드 기준 0부터 시작)[m
[32m+[m[32m    const [totalPages, setTotalPages] = useState(1);  // 전체 페이지 수[m
[32m+[m[32m    const [searchQuery, setSearchQuery] = useState({  // 검색 요소 상태[m
[32m+[m[32m        name: '',[m
[32m+[m[32m        email: '',[m
[32m+[m[32m        phone: '',[m
[32m+[m[32m        role: ''[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);[m
[32m+[m
[32m+[m[32m    // ✅ 검색어 디바운스 처리[m
[32m+[m[32m    useEffect(() => {[m
[32m+[m[32m        const timer = setTimeout(() => {[m
[32m+[m[32m            setDebouncedSearchQuery(searchQuery);[m
[32m+[m[32m        }, 500); // 500ms 후에 변경된 검색어로 API 호출[m
[32m+[m
[32m+[m[32m        return () => clearTimeout(timer); // 타이머 정리[m
[32m+[m[32m    }, [searchQuery]);[m
[32m+[m
[32m+[m[32m    // ✅ 유저 리스트 가져오기 (페이징 적용 및 검색 조건 포함)[m
[32m+[m[32m    const fetchUsers = async (page = 0, size = 10, query = {}) => {[m
[32m+[m[32m        setLoading(true);[m
[32m+[m[32m        setError(null);[m
[32m+[m[32m        try {[m
[32m+[m[32m            const response = await fetchWithAuth(`${API_URL}members/list`, {[m
[32m+[m[32m                method: 'GET',[m
[32m+[m[32m                params: {[m
[32m+[m[32m                    page,[m
[32m+[m[32m                    size,[m
[32m+[m[32m                    ...query[m
[32m+