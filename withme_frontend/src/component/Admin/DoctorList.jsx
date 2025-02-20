import React, { useState, useEffect } from 'react';
import '../../css/DoctorList.css';
//import DoctorView from './DoctorView'; // DoctorView가 존재하는지 확인 필요
import { useNavigate, Link } from 'react-router-dom';
import { fetchWithAuth } from '../../common/fetchWithAuth'; // fetchWithAuth import
import { API_URL } from '../../constant';

/**
 * 전문가 리스트 페이지
 * - 전문가 목록 출력
 *   전문가번호 / 이름 / 담당과목 / 병원정보 / 상태
 * - 전문가 검색
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
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const itemsPerPage = 10;
    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // 전문가 리스트 가져오기
    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            // 데이터 가져오기
            console.log("전문가 리스트 가져오기");
            const response = await fetchWithAuth(`${API_URL}admin/doctor/list`);
            console.log("전문가 response 확인 : ", response);
            const data = await response.json();
            setDoctors(data); // 서버에서 받은 데이터로 상태 업데이트
        } catch (err) {
            setError('전문가 데이터를 가져오는 데 실패했습니다.'); // 오류 발생 시 오류 메시지 업데이트
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors(); // 컴포넌트 마운트 시 전문가 리스트 가져오기
    }, []);

    // 검색딜레이 - 입력이 멈추면 검색
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer); // 기존 타이머 제거 (연속 입력 시 딜레이 유지)
    }, [searchQuery]);

    return (
        <div className="doctor-list-container">
            <h1 className="title">전문가 리스트</h1>

            {/* 검색창 */}
            <div className="search-bar">
                <input type="text" placeholder="이름 검색" name="name" value={searchQuery.name} onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })} />
                <input type="text" placeholder="담당과목 검색" name="subject" value={searchQuery.subject} onChange={(e) => setSearchQuery({ ...searchQuery, subject: e.target.value })} />
                <input type="text" placeholder="병원정보 검색" name="hospital" value={searchQuery.hospital} onChange={(e) => setSearchQuery({ ...searchQuery, hospital: e.target.value })} />
                <select name="status" value={searchQuery.status} onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}>
                    <option value="">상태 선택</option>
                    <option value="APPROVED">승인</option>
                    <option value="PENDING">대기</option>
                    <option value="REJECTED">거절</option>
                    <option value="ON_HOLD">보류</option>
                </select>
            </div>
        </div>
    );
}
