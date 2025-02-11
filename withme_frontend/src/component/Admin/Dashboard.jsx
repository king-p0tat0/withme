import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchWithAuth } from '../../common/fetchWithAuth'; // fetchWithAuth import
import { API_URL } from '../../constant';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const [newRegistrations, setNewRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNewRegistrations = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth(`${API_URL}admin/new-registrations`, {
                    method: 'GET',
                });
                const data = await response.json();
                setNewRegistrations(data);  // 서버에서 받은 데이터를 상태에 저장
            } catch (err) {
                console.error("API 요청 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewRegistrations();
    }, []);

    // 일별 신규 가입자 수 데이터를 차트에 맞게 변환
    const chartData = {
        labels: newRegistrations.map((data) => data.date),  // 날짜
        datasets: [
            {
                label: '일별 신규 가입자',
                data: newRegistrations.map((data) => data.count),  // 가입자 수
                borderColor: '#4CAF50',  // 선 색
                backgroundColor: 'rgba(76, 175, 80, 0.2)',  // 배경 색
                fill: true,
                tension: 0.1,  // 곡선 정도
            },
        ],
    };

    // 차트 옵션 (옵션은 필요에 따라 추가 가능)
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '일별 신규 가입자 현황',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '날짜',
                },
            },
            y: {
                title: {
                    display: true,
                    text: '가입자 수',
                },
                min: 0,
            },
        },
    };

    return (
        <div className="dashboard-container">
            <h1>대시보드</h1>
            {loading ? (
                <p>데이터를 불러오는 중...</p>
            ) : (
                <div>
                    <h2>일별 신규 가입자 현황</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
}
