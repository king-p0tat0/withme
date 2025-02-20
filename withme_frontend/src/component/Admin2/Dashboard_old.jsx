import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { fetchWithAuth } from '../../common/fetchWithAuth';
import { API_URL } from '../../constant';
import '../../assets/css/admin/Dashboard.css';
import { useSelector, useDispatch } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
    const [newRegistrations, setNewRegistrations] = useState([]);
    const [newDoctorApplications, setNewDoctorApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState(null); // 모달 상태



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [registrationsRes, applicationsRes] = await Promise.all([
                    fetchWithAuth(`${API_URL}admin/newRegistrations`),
                    fetchWithAuth(`${API_URL}admin/newDoctorApplications`)
                ]);

                const registrationsData = await registrationsRes.json();
                const applicationsData = await applicationsRes.json();

                setNewRegistrations(registrationsData);
                setNewDoctorApplications(applicationsData);
            } catch (err) {
                console.error("API 요청 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 차트 데이터 변환
    const getChartData = (data, label, color) => ({
        labels: data.map((d) => d.date),
        datasets: [
            {
                label: label,
                data: data.map((d) => d.count),
                borderColor: color,
                backgroundColor: `${color}40`,
                fill: true,
                tension: 0.1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '최근 3개월 데이터',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: { display: true, text: '날짜' },
            },
            y: {
                title: { display: false, text: '건수' },
                min: 0,
            },
        },
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">대시보드</h1>

            {loading ? (
                <p className="loading-text">데이터를 불러오는 중...</p>
            ) : (
                <div className="chart-grid">
                    {/* 신규 가입자 차트 */}
                    <div
                        className="chart-box"
                        onClick={() => setSelectedChart('registrations')}
                    >
                        <h2 className="chart-title">일별 신규 가입자</h2>
                        <Line data={getChartData(newRegistrations, '신규 가입자', '#4CAF50')} options={chartOptions} />
                    </div>

                    {/* 신규 전문가 신청 차트 */}
                    <div
                        className="chart-box"
                        onClick={() => setSelectedChart('applications')}
                    >
                        <h2 className="chart-title">일별 신규 전문가 신청</h2>
                        <Line data={getChartData(newDoctorApplications, '신규 전문가 신청', '#FF9800')} options={chartOptions} />
                    </div>
                </div>
            )}

            {/* 모달 */}
            {selectedChart && (
                <div className="modal-overlay" onClick={() => setSelectedChart(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {selectedChart === 'registrations' ? '일별 신규 가입자' : '일별 신규 전문가 신청'}
                        </h2>
                        <Line
                            data={
                                selectedChart === 'registrations'
                                    ? getChartData(newRegistrations, '신규 가입자', '#4CAF50')
                                    : getChartData(newDoctorApplications, '신규 전문가 신청', '#FF9800')
                            }
                            options={chartOptions}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
