import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import { API_URL } from '../../constant';

export default function DoctorViewAdmin({ doctor, onClose, docList }) {

  // 상태 변경에 필요한 상태 추가
  const [status, setStatus] = useState(doctor.status);  // 현재 상태
  const [reason, setReason] = useState('');  // 거절/보류 시 사용할 사유

  /* 승인 상태 변경 버튼 이벤트
   * - 승인 버튼을 누르면 해당 전문가의 userId와 승인 상태를 보내서 approveDoctorApplication 함수 실행
   */
  const handleApprove = async (email, status, reason) => {
    try {
      const response = await fetchWithAuth(`${API_URL}admin/doctor/approve/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason })  // reason 추가
      });

      if (response.ok) {
        alert('상태 변경 성공');
        onClose();
        docList(); // 리스트 새로고침
      } else {
        console.error('상태 변경 실패', response.status);
      }
    } catch (error) {
      console.error('상태 변경 실패', error);
    }
  };

  // 상태값 한글 변환
  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return '승인';
      case 'PENDING':
        return '대기';
      case 'REJECTED':
        return '거절';
      case 'ON_HOLD':
        return '보류';
      default:
        return status;
    }
  };

  const statuses = [
    { value: 'APPROVED', label: '승인' },
    { value: 'PENDING', label: '대기' },
    { value: 'REJECTED', label: '거절' },
    { value: 'ON_HOLD', label: '보류' }
  ];

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>전문가 상세 정보</h2>
        <p><strong>아이디:</strong> {doctor.member.userId}</p>
        <p><strong>이름:</strong> {doctor.member.name}</p>
        <p><strong>이메일:</strong> {doctor.member.email}</p>
        <p><strong>연락처:</strong> {doctor.member.phone}</p>
        <p><strong>전문분야:</strong> {doctor.subject}</p>
        <p><strong>병원:</strong> {doctor.hospital}</p>
        <p><strong>가입일:</strong> {doctor.member.createdAt}</p>
        <p><strong>상태:</strong> {getStatusText(doctor.status)}</p>

        {/* 상태 변경 버튼 */}
        {statuses.map((status) => (
          <div key={status.value} className="status-button-container">
            <button
              className={`modal-button modal-button-${status.value}`}
              onClick={() => setStatus(status.value)}  // 상태 업데이트
            >
              {status.label}
            </button>

            {/* 거절/보류 상태일 경우 사유 입력 필드 */}
            {(status.value === 'REJECTED' || status.value === 'ON_HOLD') && status.value === status &&
              <div className="reason-input">
                <label>사유를 입력하세요:</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="사유를 입력해주세요"
                  required
                />
              </div>
            }
          </div>
        ))}

        {/* 상태 변경을 처리하는 버튼 */}
        <button
          className="modal-button modal-button-approve"
          onClick={() => handleApprove(doctor.member.email, status, reason)}
        >
          상태 변경
        </button>

        {/* 닫기 버튼 */}
        <button className="modal-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
