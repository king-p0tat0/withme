import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";
import { API_URL } from "../../../constant";

export default function DoctorViewAdmin({ doctor, onClose, docList }) {
  // ESC 키 입력 시 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  /* 승인 상태 변경 버튼 이벤트
  - 승인 버튼을 누르면 해당 전문가의 userId와 승인 상태를 보내서 approveDoctorApplication 함수 실행
 */
  const handleApprove = async (email, status) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}admin/doctor/approve/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        alert("상태 변경 성공");
        onClose();
        docList(); // 리스트 새로고침
      } else {
        console.error("상태 변경 실패", response.status);
      }
    } catch (error) {
      console.error("상태 변경 실패", error);
    }
  };

  //     상태값 한글 변환
  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "승인";
      case "PENDING":
        return "대기";
      case "REJECTED":
        return "거절";
      case "ON_HOLD":
        return "보류";
      default:
        return status;
    }
  };

  const statuses = [
    { value: "approved", label: "승인" },
    { value: "pending", label: "대기" },
    { value: "rejected", label: "거절" },
    { value: "on_hold", label: "보류" }
  ];

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>전문가 상세 정보</h2>
        <p>
          <strong>이름:</strong> {doctor.member.name}
        </p>
        <p>
          <strong>이메일:</strong> {doctor.member.email}
        </p>
        <p>
          <strong>연락처:</strong> {doctor.member.phone}
        </p>
        <p>
          <strong>전문분야:</strong> {doctor.subject}
        </p>
        <p>
          <strong>병원:</strong> {doctor.hospital}
        </p>
        <p>
          <strong>가입일:</strong> {doctor.member.createdAt}
        </p>
        <p>
          <strong>상태:</strong> {getStatusText(doctor.status)}
        </p>

        {statuses.map((status) => (
          <button
            key={status.value}
            className={`modal-button modal-button-${status.value}`}
            onClick={() => handleApprove(doctor.member.email, status.value)}>
            {status.label}
          </button>
        ))}

        <button className="modal-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
