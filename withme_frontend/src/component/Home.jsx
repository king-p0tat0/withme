import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
  const { user, isLoggedIn } = useSelector((state) => state.auth); // 🔹 로그인 상태 가져오기
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 훅

  /**
   * 🚀 "문진하러 가기" 클릭 시 회원 상태에 따라 자동 이동
   * - 비로그인 상태 → 로그인 페이지 이동
   * - 무료 회원 → 무료 문진 페이지 이동
   * - 유료 회원 → 유료 문진 페이지 이동
   */
  const handleSurveyNavigation = (e) => {
    e.preventDefault(); // 🔹 기본 링크 동작 방지 후 직접 이동

    if (!isLoggedIn || !user) {
      navigate("/login"); // 🔹 로그인 필요
      return;
    }

    if (user.role === "PAID" || user.role === "VIP") {
      navigate("/survey/paid"); // 🔹 유료 회원 → 유료 문진 이동
    } else {
      navigate("/survey/free"); // 🔹 무료 회원 → 무료 문진 이동
    }
  };

  return (
    <>
      <div className="Home">
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="#">전체상품</Link></li>
            <li><Link to="/notice">공지사항</Link></li>
            <li><Link to="/posts">커뮤니티</Link></li>
            <li className="search-box">
              <input type="text" placeholder="어떤 상품을 찾아볼까요?" className="search-input" />
              <FontAwesomeIcon icon={faSearch} className="fas fa-search" />
            </li>
            <li><img src="/assets/images/logo.png" alt="로고 이미지" className="footer-logo" /></li>
          </ul>
        </nav>

        <div className="container">
          <div className="banner">
            <img src="/assets/images/banner.png" alt="배너 이미지" />

            {/* ✅ 기존 디자인 유지: 텍스트 링크 클릭 시 자동 이동 */}
            <Link to="#" onClick={handleSurveyNavigation} className="survey-link">
              문진하러 가기 &gt;
            </Link>
          </div>

          <div className="item-wrap">
            <div className="notice">
              <span className="red" style={{ color: "red" }}>공지사항</span> 📢 <span className="line">|</span> " 폭설이 내릴 예정이에요 ⛄❄ 눈길 조심! "
            </div>

            {/* 상품 리스트 */}
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
                  <li className="product-item">
                    <Link to="#" className="productLink">
                      <img src="/assets/images/product/product2.jpg" alt="상품이미지2" />
                      <div className="product-info">
                        <h3 className="productName">힐스 다이어트 체중관리 어덜트 스몰포 라이트 (스몰앤미니) 1.5kg</h3>
                        <p className="price">27,800원</p>
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
      </div>
    </>
  );
}

export default Home;
