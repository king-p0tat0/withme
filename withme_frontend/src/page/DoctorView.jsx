import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import '../css/DoctorList.css';
// import '../css/DoctorView.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DoctorView() {


        return (
            <div>
                <h1>{doctor.user.userName} 상세보기</h1>
                <p>전문가번호: {doctor.id}</p>
                <p>담당과목: {doctor.subject}</p>
                <p>병원정보: {doctor.hospital}</p>
                <p>상태: {doctor.status}</p>
            </div>
        );
    };