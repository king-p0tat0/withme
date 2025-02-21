import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import { fetchWithAuth } from '../common/fetchWithAuth';
import { API_URL, SERVER_URL2 } from "../constant";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Modal, Box, Typography, Button, Badge } from "@mui/material";
import useWebSocket from "../hook/useWebSocket";

import './Home.css';
import '../assets/css/shop/ItemList.css';

function Home() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ content: "", senderName: "" });
  const [lastMessageId, setLastMessageId] = useState(null);
  const [newConsultationCount, setNewConsultationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { lastMessage } = useWebSocket(user);

  // 문진 함수
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

// 공지사항 데이터 불러오기 함수
const fetchNotices = async () => {
  try {
    const response = await fetchWithAuth(`${API_URL}notices?page=0&size=5`);
    if (!response.ok) throw new Error('공지사항을 불러오는 데 실패했습니다.');
    const data = await response.json();
    setNotices(data.content);  // 공지사항 데이터를 상태에 저장
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

  const filteredItems = items.filter((item) =>
    item.itemNm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const renderItemCard = (item) => (
    <div className="item-card" key={item.id}>
      {item.itemImgDtoList?.length > 0 && (
        <div className="image-container">
          <img
            src={`${SERVER_URL2}${item.itemImgDtoList[0].imgUrl}`}
            alt={item.itemNm}
            className="item-image"
            style={{ boxShadow: "none", width: "250px" }}
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
            <img src="/assets/images/icon/cart.png" alt="cart" className="cartIcon" style={{ width: "25px" }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="Home">
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/item/list">쇼핑몰</Link></li>
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


              <div className="item-wrap">
                <div className="notice">
                  <span className="red" style={{ color: "red" }}>공지사항</span> 📢 <span className="line">|</span>
                  {notices.length > 0 ? (
                    notices[0].title
                  ) : (
                    "최근 공지사항이 없습니다."
                  )}
                </div>
              </div>
            </div>

      <div className="container">
        <div className="banner">
          <img src="/assets/images/banner.png" alt="배너 이미지" className="bannerImage" />
          <Link onClick={handleSurveyNavigation}>문진하러 가기 &gt;</Link>
        </div>

        <div className="item-container">
          <p className="item-title">이 상품은 어떠세요?</p>
          <div className="item-grid">
            {loading ? (
              <p>상품을 불러오는 중...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : filteredItems.length === 0 ? (
              <div className="no-results-container">
                <img src="/assets/images/searchDog.png" alt="cannotFound" className="cannotFound" />
                <p>'{searchQuery}'에 대한 검색한 결과를 찾을 수가 없어요.</p>
                <p>다른 검색어로 검색을 해보시겠어요?</p>
              </div>
            ) : (
              currentItems.map((item) => renderItemCard(item))
            )}
          </div>
        </div>

        <button
            className="moreBtn"
            onClick={() => navigate(`/item/list`)}
            style={{ marginBottom: "50px"}}
            >
            더 많은 상품 보러가기
            </button>

        {/* 필터링된 상품 섹션 */}
        <div className="filtered-container">
          <div style={{ marginLeft: "10%" }}>
            <p style={{ paddingTop: "20px" }} className="item-title">
              {pets.length === 0 ? (
                "우리 아이 맞춤 상품💕"
              ) : (
                pets.map((pet) => (
                  <p key={pet.petId}>{pet.name}에게 추천해요💕</p>
                ))
              )}
            </p>
            {!isLoggedIn || !user?.roles?.includes("VIP") ? (
              <div className="membership-message">
                맴버쉽 가입 후 이용 가능한 컨텐츠입니다.
              </div>
            ) : null}
            <div className={`item-grid ${(!isLoggedIn || !user?.roles?.includes("VIP")) ? "blurred" : ""}`}>
              {filteredItems.length > 0 ? (
                filteredItems.map(renderItemCard)
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="message-modal-title"
        aria-describedby="message-modal-description"
      >
        <Box className="message-modal">
          <Typography variant="h6" id="message-modal-title">새 메시지</Typography>
          <Typography variant="body2" id="message-modal-description">{modalMessage.content}</Typography>
          <Typography variant="caption">From: {modalMessage.senderName}</Typography>
          <Button onClick={() => setModalOpen(false)} color="primary">닫기</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Home;
