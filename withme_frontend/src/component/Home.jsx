import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useWebSocket from "../hook/useWebSocket";
import { Modal, Box, Typography, Button, Badge } from "@mui/material";

function Home() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ content: "", senderName: "" });
  const [lastMessageId, setLastMessageId] = useState(null);
  const [newConsultationCount, setNewConsultationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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
          setNewConsultationCount(prevCount => prevCount + 1);
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
              setNewConsultationCount(prevCount => prevCount + 1);
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
        setNewConsultationCount(prevCount => prevCount + 1);
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
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (user.role === "PAID" || user.role === "VIP") {
      navigate("/survey/paid");
    } else {
      navigate("/survey/free");
    }
  };

  // ✅ 상담내역 페이지 이동
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

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 실행 핸들러
  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        // 로그인한 사용자이고 반려동물이 있는 경우
        if (isLoggedIn && user?.petId) {
          navigate(
            `/item/search?query=${encodeURIComponent(searchQuery)}&petId=${
              user.petId
            }`
          );
        } else {
          // 일반 검색
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
    <div className="Home">
      <nav>
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/item/list">전체상품</Link>
          </li>
          <li>
            <Link to="/notices">공지사항</Link>
          </li>
          <li>
            <Link to="/posts">커뮤니티</Link>
          </li>
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
          <li>
            <img
              src="/assets/images/logo.png"
              alt="로고 이미지"
              className="footer-logo"
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

        <div className="item-wrap">
          <div className="notice">
            <span className="red" style={{ color: "red" }}>
              공지사항
            </span>{" "}
            📢 <span className="line">|</span> " 오늘은 발렌타인데이입니다 🍫
            달콤한 하루 보내세요 💕 "
          </div>

          <div className="product-list all-product-list">
            <p>전체 상품</p>
            <hr />
            <div className="products">
              <ul>
                <li className="product-item">
                  <Link to="#" className="productLink">
                    <img
                      src="/assets/images/product/product1.png"
                      alt="상품이미지1"
                    />
                    <div className="product-info">
                      <h3 className="productName">
                        로얄캐닌 처방식 하이포알러제닉 1.5kg
                      </h3>
                      <p className="price">34,500원</p>
                      <button type="button" className="product-btn">
                        구매하기
                      </button>
                    </div>
                  </Link>
                </li>
                <li className="product-item">
                  <Link to="#" className="productLink">
                    <img
                      src="/assets/images/product/product2.jpg"
                      alt="상품이미지2"
                    />
                    <div className="product-info">
                      <h3 className="productName">
                        힐스 다이어트 체중관리 어덜트 스몰포 라이트 (스몰앤미니)
                        1.5kg
                      </h3>
                      <p className="price">27,800원</p>
                      <button type="button" className="product-btn">
                        구매하기
                      </button>
                    </div>
                  </Link>
                </li>
                <li className="product-item">
                  <Link to="#" className="productLink">
                    <img
                      src="/assets/images/product/product3.jpg"
                      alt="상품이미지3"
                    />
                    <div className="product-info">
                      <h3 className="productName">
                        NOW 그레인프리 스몰브리드 어덜트 1.4kg
                      </h3>
                      <p className="price">19,900원</p>
                      <button type="button" className="product-btn">
                        구매하기
                      </button>
                    </div>
                  </Link>
                </li>
                <li className="product-item">
                  <Link to="#" className="productLink">
                    <img
                      src="/assets/images/product/product4.png"
                      alt="상품이미지4"
                    />
                    <div className="product-info">
                      <h3 className="productName">
                        로얄캐닌 미니 인도어 어덜트 3kg
                      </h3>
                      <p className="price">44,800원</p>
                      <button type="button" className="product-btn">
                        구매하기
                      </button>
                    </div>
                  </Link>
                </li>
              </ul>
              <button type="button" className="moreBtn">
                더 구경하기
              </button>
            </div>
          </div>

          <div className="product-list filtered-product-list">
            <p>필터링 적용 상품</p>
            <hr />
            {!isLoggedIn && (
              <div className="membership-overlay" id="membershipOverlay">
                회원 전용 컨텐츠입니다.
                <br />
                로그인 후 이용해주세요.
              </div>
            )}

            <div
              className={`products filtered-products ${
                isLoggedIn ? "" : "blur"
              }`}
              id="productSection"
            >
              <ul>
                {[...Array(4)].map((_, index) => (
                  <li className="product-item" key={index}>
                    <Link to="#" className="productLink">
                      <img
                        src="/assets/images/product/product1.png"
                        alt="상품이미지"
                      />
                      <div className="product-info">
                        <h3>로얄캐닌 처방식 하이포알러제닉 1.5kg</h3>
                        <p className="price">34,500원</p>
                        <button type="button" className="product-btn">
                          구매하기
                        </button>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" className="moreBtn">
                더 구경하기
              </button>
            </div>
          </div>
        </div>
      </div>

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
  );
}

export default Home;