
    // 기존 handleApprove 함수 유지
    const handleApprove = async (email, status) => {
        // ... 기존 코드 유지
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>전문가 상세 정보</h2>
                <p><strong>이름:</strong> {doctor.member.name}</p>
                <p><strong>전문분야:</strong> {doctor.subject}</p>
                <p><strong>병원:</strong> {doctor.hospital}</p>
                <p><strong>이메일:</strong> {doctor.member.email}</p>

                {/* 기존 버튼들 유지 */}
                <button onClick={() => handleApprove(doctor.member.email, 'approved')}>승인</button>
                <button onClick={() => handleApprove(doctor.member.email, 'rejected')}>거절</button>
                <button onClick={() => handleApprove(doctor.member.email, 'on_hold')}>보류</button>
                <button onClick={() => handleApprove(doctor.member.email, 'pending')}>대기</button>

                {/* 새로운 상담 문의 알림 버튼 추가 */}
                <Badge badgeContent={unreadCount} color="error" sx={{ margin: '10px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/doctor/messages")}
                    >
                        상담 문의 확인
                    </Button>
                </Badge>

                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};