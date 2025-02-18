import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from '../common/fetchWithAuth';
import { API_URL, SERVER_URL2 } from "../constant"; // API_URL 가져오기
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [items, setItems] = useState([]);  // 상품 리스트 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [notices, setNotices] = useState([]);  // 공지사항 리스트 상태
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  // 컴포넌트 마운트 시 호출
  useEffect(() => {
    fetchNotices();
    fetchItems();
    document.body.style.backgroundColor = "#FEF9F6";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSurveyNavigation = (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate("/login");
      return;
    }

    if (user.role === "PAID" || user.role === "VIP") {
      navigate("/survey/paid");
    } else {
      navigate("/survey/free");
    }
  };

  return (
    <div className="Home">
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/item/list">쇼핑몰</Link></li>
          <li><Link to="/notices">공지사항</Link></li>
          <li><Link to="/posts">커뮤니티</Link></li>
          <li className="search-box">
            <input type="text" placeholder="어떤 상품을 찾아볼까요?" className="search-input" />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </li>
          <li><img src="/assets/images/logo.png" alt="로고 이미지" className="footer-logo" /></li>
        </ul>
      </nav>

      <div className="container">
        <div className="banner">
          <img src="/assets/images/banner.png" alt="배너 이미지" className="bannerImage" />
          <Link to="#" onClick={handleSurveyNavigation} className="survey-link">문진하러 가기 &gt;</Link>
        </div>

        <div className="item-wrap">
          <div className="notice">
            <span className="red" style={{ color: "red" }}>공지사항</span> 📢 <span className="line">|</span>
            {/* 공지사항 제목 동적 렌더링 */}
            {notices.length > 0 ? (
              notices[0].title // 첫 번째 공지사항 제목을 표시 (필요에 따라 수정 가능)
            ) : (
              "최근 공지사항이 없습니다."
            )}
          </div>

          <div className="product-list all-product-list">
            <p>전체 상품</p>
            <hr />
            <div className="products">
              {loading ? (
                <p>상품을 불러오는 중...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <ul>
                  {items.slice(0, 8).map((item) => ( // 상품 2줄, 8개만 노출
                    <li className="product-item" key={item.itemId}>
                      <div className="productLink">
                        <img
                          src={`${SERVER_URL2}${item.itemImgDtoList[0]?.imgUrl}`}
                          alt={item.itemNm}
                          className="product-image"
                        />

                        <div className="image-overlay">
                          <button
                            className="view-details-btn"
                            onClick={() => navigate(`/item/view/${item.itemId}`)} // 상세보기로 이동
                          >
                            상세보기
                          </button>
                        </div>
                        <div className="product-info">
                          <h3 className="productName">{item.itemNm}</h3>
                          <p className="price">{item.price.toLocaleString()}원</p>
                          <button type="button" className="product-btn">구매하기</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" className="moreBtn">더 구경하기</button>
            </div>
          </div>

          <div className="product-list filtered-product-list">
            <p>필터링 적용 상품</p>
            <hr />
            {!isLoggedIn && (
              <div className="membership-overlay" id="membershipOverlay">
                회원 전용 컨텐츠입니다.<br />
                로그인 후 이용해주세요.
              </div>
            )}

            <div className={`products filtered-products ${isLoggedIn ? "" : "blur"}`} id="productSection">
              <ul>
                {[...Array(4)].map((_, index) => (
                  <li className="product-item" key={index}>
                    <Link to="#" className="productLink">
                      <img src="/assets/images/product/product1.png" alt="상품이미지" />
                      <div className="product-info">
                        <h3>로얄캐닌 처방식 하이포알러제닉 1.5kg</h3>
                        <p className="price">34,500원</p>
                        <button type="button" className="product-btn">구매하기</button>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" className="moreBtn">더 구경하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
