import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainNotice from "./notice/MainNotice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  return (
    <>
      <div className="Home">
        <nav>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="#">전체상품</Link>
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
              />
              <FontAwesomeIcon icon={faSearch} className="fas fa-search" />
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

            {/* ✅ 기존 "/survey" → "/survey-main"으로 변경 */}
            <Link to="/survey-main">문진하러 가기 &gt;</Link>
          </div>

          <div className="item-wrap">
            <div className="notice">
              {/* MainNotice 컴포넌트로 대체 */}
              <MainNotice />
              {/* <span className="red" style={{ color: "red" }}>
                공지사항
              </span>{" "}
              📢 <span className="line">|</span> " 폭설이 내릴 예정이에요 ⛄❄
              눈길 조심! " */}
            </div>

            {/* 상품 리스트 */}
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
                          힐스 다이어트 체중관리 어덜트 스몰포 라이트
                          (스몰앤미니) 1.5kg
                        </h3>
                        <p className="price">27,800원</p>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
