import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useWebSocket from "../hook/useWebSocket";
import { Modal, Box, Typography, Button, Badge } from "@mui/material";
import { fetchWithAuth } from '../common/fetchWithAuth';
import { API_URL, SERVER_URL2 } from "../constant";

import './Home.css';
import '../assets/css/shop/ItemList.css';

function Home() {
  const [items, setItems] = useState([]);  // 상품 리스트 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [notices, setNotices] = useState([]);  // 공지사항 리스트 상태
  const [pets, setPets] = useState([]); // pets 상태 추가
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // 상품 검색 상태
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태
  const [cart, setCart] = useState([]); // 장바구니 상태
  const itemsPerPage = 8;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ content: "", senderName: "" });
  const [lastMessageId, setLastMessageId] = useState(null);
  const [newConsultationCount, setNewConsultationCount] = useState(0);

  // 장바구니 추가 함수
  const handleAddToCart = async (item) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const cartItem = {
        itemId: item.id,
        count: 1 // 기본 수량 1개
      };

      const response = await fetchWithAuth(`${API_URL}cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem)
      });

      if (response.ok) {
        alert('장바구니에 추가되었습니다.');
      } else {
        const errorMsg = await response.text();
        alert(`장바구니 추가 실패: ${errorMsg}`);
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

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
    try {
      if (userRoles.includes("ROLE_PAID") || userRoles.includes("ROLE_VIP")) {
        navigate("/survey/paid");
      } else {
        navigate("/survey/free");
      }
    } catch (error) {
      console.error("문진 페이지로 이동 실패:", error);
    }
  };

  // 공지사항 데이터 불러오기
  const fetchNotices = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}notices?page=0&size=5`);
      if (!response.ok) throw new Error('공지사항을 불러오는 데 실패했습니다.');

      const data = await response.json();
      setNotices(data.content);  // 공지사항 목록을 상태에 저장
    } catch (error) {
      console.error(error);
      alert('공지사항 데이터를 가져오는 데 문제가 발생했습니다.');
    }
  };

  // 상품 데이터 불러오기
  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}item/list`);
      const data = await response.json();
      setItems(data);  // 받은 데이터 상태에 저장
    } catch (err) {
      setError('상품 데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 반려견 정보 불러오기
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}pets/user/${user.id}`);
        if (response.ok) {
          const result = await response.json();
          setPets(result.content || []);
        }
      } catch (error) {
        console.error("반려동물 정보 로드 중 오류:", error);
      }
    };

    if (isLoggedIn && user) {
      fetchPetData();
    }
  }, [isLoggedIn, user]);

  // 컴포넌트 마운트 시 호출
  useEffect(() => {
    fetchNotices();
    fetchItems();
    document.body.style.backgroundColor = "#FEF9F6";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 필터링된 상품 목록
  const filteredItems = items.filter((item) =>
    item.itemNm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 렌더링 함수 (상품 카드)
  const renderItemCard = (item) => (
    <div className="item-card" key={item.id}>
      {item.itemImgDtoList?.length > 0 && (
        <div className="image-container">
          <img
            src={`${SERVER_URL2}${item.itemImgDtoList[0].imgUrl}`}
            alt={item.itemNm}
            className="item-image"
            style={{ boxShadow: "none" }}
          />
          <button
            className="view-details-btn"
            onClick={() => navigate(`/item/view/${item.id}`)}
          >
            상세보기
          </button>
        </div>
      )}

      <div className="item-detail-wrap">
        <h3 className="itemName">{item.itemNm}</h3>
        <div className="price-cart-container">
          <p className="price">{item.price.toLocaleString()}원</p>
          <button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(item)}
            disabled={item.itemSellStatus === 'SOLD_OUT'}
          >
            <img src="/assets/images/icon/cart.png" alt="cart" className="cartIcon" />
          </button>
        </div>
      </div>
    </div>
  );

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
    <div className="Home">
      {/* 네비게이션, 배너, 상품, 공지사항 등의 JSX */}
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
