import DoctorUpdate from './DoctorUpdate';
import DoctorList from './DoctorList';
import DoctorView from './DoctorView';
import UserList from './UserList';
import ItemAdd from '../shop/Product/ItemAdd';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from './Dashboard';
import ItemList from './ItemList';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faChevronDown, faHouse, faUser, faStarOfLife, faTag, faPen } from "@fortawesome/free-solid-svg-icons";

import '../../assets/css/admin/Admin.css';

export default function Admin({ user }) {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();


    // 드롭다운 상태 관리
    const [showDoctorMenu, setShowDoctorMenu] = useState(false);
    const [showCustomerMenu, setShowCustomerMenu] = useState(false);
    const [showShopMenu, setShowShopMenu] = useState(false);

    // 현재 보여줄 페이지 상태 관리
    const [currentPage, setCurrentPage] = useState(<Dashboard />);

    // 메뉴 항목 활성화 상태 관리
    const [activeMenu, setActiveMenu] = useState('home');  // 'home', 'doctor', 'customer', 'shop', 'notice'

    // 클릭 시 드롭다운 닫히게 하는 효과
    useEffect(() => {
        // 다른 곳을 클릭하면 드롭다운을 닫기 위한 이벤트 핸들러
        const handleClickOutside = (e) => {
            // .side-menu 외부를 클릭했을 경우에만 드롭다운 닫기
            if (!e.target.closest('.menu-header')) {
                setShowDoctorMenu(false);
                setShowCustomerMenu(false);
                setShowShopMenu(false);
            }
        };

        // 클릭 이벤트 리스너 추가
        document.addEventListener('click', handleClickOutside);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="admin-container">
            {/* 사이드 메뉴 */}
            <div className="side-menu">
                <div className="admin-profile">
                    <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
                    <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>관리자</p>
                    <Link to={`/mypage/${user.id}`} style={{ textDecoration: "none", color: "white" }}>{loggedInUser.email}</Link>
                </div>
                <ul>
                    {/* 홈 카테고리 */}
                    <div className="category">
                        <p
                            className="menu-header home-header"
                            onClick={() => {
                                setCurrentPage(<Dashboard user={user} />);
                                setActiveMenu('home');
                                setShowDoctorMenu(false);
                                setShowCustomerMenu(false);
                                setShowShopMenu(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faHouse} className="left-icon" /> 홈 <FontAwesomeIcon icon={faChevronDown} className="right-icon" style={{ color: "#353535" }} />
                        </p>
                    </div>

                    {/* 전문가 관리 카테고리 */}
                    <div className="category">
                        <p
                            className={`menu-header ${activeMenu === 'doctor' ? 'active' : ''}`}
                            onClick={() => {
                                setShowDoctorMenu(!showDoctorMenu);
                                setShowCustomerMenu(false); // 다른 메뉴 닫기
                                setShowShopMenu(false); // 다른 메뉴 닫기
                                setActiveMenu('doctor');
                            }}
                        >
                            <FontAwesomeIcon icon={faStarOfLife} className="left-icon" /> 수의사 관리 <FontAwesomeIcon icon={faChevronDown} className="right-icon" />
                        </p>
                        <div className={`menu-items ${showDoctorMenu ? 'show' : ''}`}>
                            <ul>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<DoctorUpdate />)}
                                >
                                    승인 대기 목록
                                </li>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<DoctorList />)}
                                >
                                    수의사 가입 현황
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 고객 관리 카테고리 */}
                    <div className="category">
                        <p
                            className={`menu-header ${activeMenu === 'customer' ? 'active' : ''}`}
                            onClick={() => {
                                setShowCustomerMenu(!showCustomerMenu);
                                setShowDoctorMenu(false); // 다른 메뉴 닫기
                                setShowShopMenu(false); // 다른 메뉴 닫기
                                setActiveMenu('customer');
                            }}
                        >
                            <FontAwesomeIcon icon={faUser} className="left-icon" /> 고객 관리 <FontAwesomeIcon icon={faChevronDown} className="right-icon"  />
                        </p>
                        <div className={`menu-items ${showCustomerMenu ? 'show' : ''}`}>
                            <ul>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<UserList />)}
                                >
                                    고객 가입 현황
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 쇼핑몰 카테고리 */}
                    <div className="category">
                        <p
                            className={`menu-header ${activeMenu === 'shop' ? 'active' : ''}`}
                            onClick={() => {
                                setShowShopMenu(!showShopMenu);
                                setShowDoctorMenu(false); // 다른 메뉴 닫기
                                setShowCustomerMenu(false); // 다른 메뉴 닫기
                                setActiveMenu('shop');
                            }}
                        >
                            <FontAwesomeIcon icon={faTag} className="left-icon" /> 쇼핑몰 <FontAwesomeIcon icon={faChevronDown} className="right-icon" />
                        </p>
                        <div className={`menu-items ${showShopMenu ? 'show' : ''}`}>
                            <ul>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<ItemAdd />)}
                                >
                                    상품 등록
                                </li>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<ItemList />)}
                                >
                                    상품 목록
                                </li>
                                <li className="menu-item">주문 관리</li>
                            </ul>
                        </div>
                    </div>

                    {/* 공지사항 카테고리 */}
                    <div className="category">
                        <p
                            className={`menu-header ${activeMenu === 'notice' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveMenu('notice');
                                setShowDoctorMenu(false); // 다른 메뉴 닫기
                                setShowCustomerMenu(false); // 다른 메뉴 닫기
                                setShowShopMenu(false); // 다른 메뉴 닫기
                            }}
                        >
                            <FontAwesomeIcon icon={faPen} className="left-icon" /> 공지사항 <FontAwesomeIcon icon={faChevronDown} className="right-icon"  />
                        </p>
                    </div>
                </ul>
                <button onClick={() => navigate(`/`)} className="exit-btn">나가기</button>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="main-content">
                {currentPage}
            </div>
        </div>
    );
}
