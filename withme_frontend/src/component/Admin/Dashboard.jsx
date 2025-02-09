import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
    const [signups, setSignups] = useState([]);
    const [consultations, setConsultations] = useState([]);

    useEffect(() => {
        // 가입자 통계 불러오기
        axios.get(`${API_URL}admin/stats/daily-signups`)
            .then(res => setSignups(res.data))
            .catch(err => console.error("가입자 통계 불러오기 실패", err));

        // 문진 신청 통계 불러오기
        axios.get(`${API_URL}admin/stats/daily-consultations`)
            .then(res => setConsultations(res.data))
            .catch(err => console.error("문진 신청 통계 불러오기 실패", err));
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>관리자 대시보드</h1>

            <div className="chart-container">
                <h2>일별 가입자 수</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={signups}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-container">
                <h2>일별 문진 신청 수</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={consultations}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
