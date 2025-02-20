import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useWebSocket from "../hook/useWebSocket";
import { Modal, Box, Typography, Button, Badge } from "@mui/material";

function Home() { // 🔧 수정됨: 함수형 컴포넌트 제대로 선언
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ content: "", senderName: "" });
  const [lastMessageId, setLastMessageId] = useState(null);
  const [newConsultationCount, setNewConsultationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // VIP 역할 확인 함수
  const isVipUser = () => {
    if (!user || !user.roles) return false;
    return user.roles.includes("ROLE_VIP");
  };

  // WebSocket 연결
  const { lastMessage } = useWebSocket(user);

  // WebSocket 메시지 처리
  useEffect(() => {
    if (lastMessage && isVipUser()) {
      if (lastMessage.messageType === 'answer' && lastMessage.senderRole === 'DOCTOR') {
        if (lastMessage.msg_id !== lastMessageId) {
          setModalMessage({
            content: lastMessage.content,
            senderName: lastMessage.senderName
          });
          setModalOpen(true);
          setLastMessageId(lastMessage.msg_id);
          setNewConsultationCount(prevCount => prevCount + 1);
        }
      }
    }

    if (isVipUser()) {
      fetch(`/api/messages/${user.id}?page=0&size=1`)
        .then(res => res.json())
        .then(data => {
          const latestMsg = data.content?.[0];
          if (latestMsg && latestMsg.msg_id !== lastMessageId) {
            const { content, senderName, msg_id } = latestMsg;
            if (content && senderName) {
              setModalMessage({ content, senderName });
              setModalOpen(true);
              setLastMessageId(msg_id);
              setNewConsultationCount(prevCount => prevCount + 1);
              console.log('🟢 팝업 표시:', content);
            }
          }
        })
        .catch(err => console.error('🚨 메시지 로드 실패:', err));
    }

    const handleMessageReceived = (event) => {
      const { content, senderName, senderRole, msg_id } = event.detail;
      if (senderRole === 'ROLE_DOCTOR' && msg_id !== lastMessageId) {
        setModalMessage({ content, senderName });
        setModalOpen(true);
        setLastMessageId(msg_id);
      }
    };

    window.addEventListener('messageReceived', handleMessageReceived);
    return () => {
      window.removeEventListener('messageReceived', handleMessageReceived);
    };
  }, [lastMessage, isVipUser, lastMessageId]);

  const handleClose = () => setModalOpen(false);

  const handleSurveyNavigation = (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    const userRoles = user.roles.replace(/[\[\]"]/g, '').split(',').map(role => role.trim());

    if (userRoles.includes("ROLE_PAID") || userRoles.includes("ROLE_VIP")) {
      navigate("/survey/paid");
    } else {
      navigate("/survey/free");
    }
  };

  const handleConsultationHistory = (e) => {
    e.preventDefault();
    setNewConsultationCount(0);
    navigate("/doctor-messages");
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#FEF9F6";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        if (isLoggedIn && user?.petId) {
          navigate(`/item/search?query=${encodeURIComponent(searchQuery)}&petId=${user.petId}`);
        } else {
          navigate(`/item/search?query=${encodeURIComponent(searchQuery)}`);
        }
      }
    }
  };

  const isDoctor = user && user.roles.includes('ROLE_DOCTOR');

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="Home">  {/* ✅ 중복된 Home div 해결 */}
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/item/list">전체상품</Link></li>
          <li><Link to="/notices">공지사항</Link></li>
          <li><Link to="/posts">커뮤니티</Link></li>
          <li className="search-box">
            <input
              type="text"
              placeholder="어떤 상품을 찾아볼까요?"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearch}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="search-icon"
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            />
          </li>
        </ul>
      </nav>

      <div className="container">
        <div className="banner">
          <img src="/assets/images/banner.png" alt="배너 이미지" />
          {isDoctor ? (
            <Badge badgeContent={newConsultationCount} color="error">
              <Link to="#" onClick={handleConsultationHistory} className="survey-link">
                상담내역 &gt;
              </Link>
            </Badge>
          ) : (
            <Link to="#" onClick={handleSurveyNavigation} className="survey-link">
              문진하러 가기 &gt;
            </Link>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={handleClose} aria-labelledby="vip-message-modal">
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            전문가의 새로운 답변 도착!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {modalMessage.senderName}: {modalMessage.content}
          </Typography>
          <Button onClick={handleClose} sx={{ mt: 2 }}>
            닫기
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Home;