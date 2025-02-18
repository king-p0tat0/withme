import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useWebSocket from "../hook/useWebSocket";
import { Modal, Box, Typography, Button } from "@mui/material";

function Home() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ content: "", senderName: "" });
  const [lastMessageId, setLastMessageId] = useState(null);

  // VIP 역할 확인 함수 (수정)
  const isVipUser = () => {
    if (!user || !user.roles) return false;
    return user.roles.includes("ROLE_VIP");
  };


  // WebSocket 연결
  const { lastMessage } = useWebSocket(user);

  // WebSocket 메시지 처리
  useEffect(() => {
    if (lastMessage && isVipUser()) {
      if (lastMessage.messageType === 'answer' && lastMessage.senderRole === 'ROLE_DOCTOR') {
        if (lastMessage.msg_id !== lastMessageId) {
          setModalMessage({
            content: lastMessage.content,
            senderName: lastMessage.senderName
          });
          setModalOpen(true);
          setLastMessageId(lastMessage.msg_id);
        }
      }
    }

    // 최신 메시지를 기존 메시지 API를 사용하여 가져오기
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
              console.log('🟢 팝업 표시:', content);
            } else {
              console.warn('⚠️ 메시지 내용이 비어 있습니다.');
            }
          } else {
            console.log('🔍 최신 메시지가 없습니다.');
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


  // 모달 닫기 핸들러
  const handleClose = () => setModalOpen(false);

  // ✅ 문진 페이지 이동 핸들러
  const handleSurveyNavigation = (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }
    const userRoles = user.roles.replace(/[\[\]]/g, '').split(',');
    if (userRoles.includes("ROLE_VIP") || userRoles.includes("ROLE_PAID")) {
      navigate("/survey/paid/selection");
    } else {
      navigate("/survey/free");
    }
  };

  // ✅ 상담내역 페이지 이동
  const handleConsultationHistory = (e) => {
    e.preventDefault();
    navigate("/doctor-messages");
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#FEF9F6";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

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
    <>
      <div className="Home">
        {/* ✅ 네비게이션 바 */}
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="#">전체상품</Link></li>
            <li><Link to="/notice">공지사항</Link></li>
            <li><Link to="/posts">커뮤니티</Link></li>
            <li className="search-box">
              <input type="text" placeholder="어떤 상품을 찾아볼까요?" className="search-input" />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </li>
            <li><img src="/assets/images/logo.png" alt="로고 이미지" className="footer-logo" /></li>
          </ul>
        </nav>

        {/* ✅ 메인 콘텐츠 */}
        <div className="container">
          <div className="banner">
            <img src="/assets/images/banner.png" alt="배너 이미지" />
            {isDoctor ? (
              <Link to="#" onClick={handleConsultationHistory} className="survey-link">
                상담내역 &gt;
              </Link>
            ) : (
              <Link to="#" onClick={handleSurveyNavigation} className="survey-link">
                문진하러 가기 &gt;
              </Link>
            )}
          </div>

          <div className="item-wrap">
            {/* ✅ 공지사항 */}
            <div className="notice">
              <span className="red" style={{ color: "red" }}>공지사항</span> 📢 <span className="line">|</span> " 폭설이 내릴 예정이에요 ⛄❄ 눈길 조심! "
            </div>

            {/* ✅ 전체 상품 리스트 */}
            <div className="product-list all-product-list">
              <p>전체 상품</p>
              <hr />
              <div className="products">
                <ul>
                  <li className="product-item">
                    <Link to="#" className="productLink">
                      <img src="/assets/images/product/product1.png" alt="상품이미지1" />
                      <div className="product-info">
                        <h3 className="productName">로얄캐닌 처방식 하이포알러제닉 1.5kg</h3>
                        <p className="price">34,500원</p>
                        <button type="button" className="product-btn">구매하기</button>
                      </div>
                    </Link>
                  </li>
                </ul>
                <button type="button" className="moreBtn">더 구경하기</button>
              </div>
            </div>
          </div>
        </div>

       {/* WebSocket 메시지 모달 */}
       <Modal
         open={modalOpen}
         onClose={handleClose}
         aria-labelledby="vip-message-modal"
       >
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
    </>
  );
}

export default Home;
