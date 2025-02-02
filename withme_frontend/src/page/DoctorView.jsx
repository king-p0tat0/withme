import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import '../css/DoctorList.css';
// import '../css/DoctorView.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DoctorView() {

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

    const { doctorId } = useParams(); // Get the doctor ID from the URL
        const doctor = mockData.find((d) => d.id === parseInt(doctorId));

        if (!doctor) {
            return <div>전문가를 찾을 수 없습니다.</div>;
        }

        return (
            <div>
                <h1>{doctor.name} 상세보기</h1>
                <p>전문가번호: {doctor.id}</p>
                <p>담당과목: {doctor.subject}</p>
                <p>병원정보: {doctor.hospital}</p>
                <p>상태: {doctor.status}</p>
            </div>
        );
    };