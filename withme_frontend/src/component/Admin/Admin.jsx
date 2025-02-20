import DoctorUpdate from './DoctorUpdate';
import DoctorList from './DoctorList';
import DoctorView from './DoctorView';
import UserList from './UserList';
import ItemAdd from '../shop/Product/ItemAdd';
import React, { useState  } from 'react';
import Dashboard from './Dashboard';
import ItemList from './ItemList';
import '../../assets/css/admin/Admin.css';

export default function Admin({user}) {
    // 드롭다운 상태 관리
    const [showDoctorMenu, setShowDoctorMenu] = useState(false);
    const [showCustomerMenu, setShowCustomerMenu] = useState(false);
    const [showShopMenu, setShowShopMenu] = useState(false);

    // 현재 보여줄 페이지 상태 관리
    const [currentPage, setCurrentPage] = useState(<Dashboard />);

    return (
        <div className="admin-container">
            {/* 사이드 메뉴 */}
            <div className="side-menu">
                <ul>
                    <div>
                        <p className="menu-header"
                        onClick={() => setCurrentPage(<Dashboard user={user}/>)}
                        > 관리자 홈</p>
                        <p
                            className="menu-header"
                            onClick={() => setShowDoctorMenu(!showDoctorMenu)}
                        >
                            전문가 관리
                        </p>
                        {showDoctorMenu && (
                            <ul className="menu-items">
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<DoctorUpdate />)}
                                >
                                    전문가 등록
                                </li>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<DoctorList />)}
                                >
                                    전문가 리스트
                                </li>
                                <li
                                    className="menu-item"
                                    onClick={() => setCurrentPage(<DoctorView />)}
                                >
                                </li>
                            </ul>
                        )}
                    </div>
                    <div>
                        <p
                            className="menu-header"
                            onClick={() => setShowCustomerMenu(!showCustomerMenu)}
                        >
                            고객 관리
                        </p>
                        {showCustomerMenu && (
                            <ul className="menu-items">
                                <li className="menu-item"
                                 onClick={() => setCurrentPage(<UserList />)}
                                 >고객 리스트</li>
                            </ul>
                        )}
                    </div>
                    <div>
                        <p
                            className="menu-header"
                            onClick={() => setShowShopMenu(!showShopMenu)}
                        >
                            쇼핑몰 관리
                        </p>
                        {showShopMenu && (
                            <ul className="menu-items">
                                <li className="menu-item"
                                 onClick={() => setCurrentPage(<ItemAdd />)}
                                 >상품 등록</li>
                                <li className="menu-item"
                                 onClick={() => setCurrentPage(<ItemList />)}
                                 >상품 목록</li>

                                <li className="menu-item">주문 관리</li>
                            </ul>
                        )}
                    </div>
                </ul>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="main-content">
                {currentPage}
            </div>
        </div>
    );
}
