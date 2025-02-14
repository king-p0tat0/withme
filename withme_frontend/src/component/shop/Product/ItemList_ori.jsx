import React, { useState, useEffect } from 'react';
import ItemView from './ItemView'; // 상세보기 컴포넌트
import { fetchWithAuth } from '../../../common/fetchWithAuth';
import { API_URL } from '../../../constant';
import '../../../assets/css/shop/ItemList.css';
import { useNavigate } from 'react-router-dom';

export default function ItemList() {
    const [items, setItems] = useState([]); // 상품 목록 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const itemsPerPage = 10;

    // 상품 목록 가져오기
    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('상품 목록 가져오기...');
            const response = await fetch(`${API_URL}item/list`);
            const data = await response.json();
            setItems(data);
            console.log("가져온 상품 데이터 : ", data);
        } catch (err) {
            setError('상품 데이터를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchItems();
    }, []);

    // 검색 딜레이 적용 (0.5초)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 검색 필터
    const filteredData = items.filter((item) =>
        item.itemNm.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 상세보기 모달 열기
    const openModal = (item) => {
        setSelectedItem(item.id);
        setIsModalOpen(true);
    };

    // 상세보기 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleViewDetail = (itemId) => {
        navigate(`/item/view/${itemId}`); // ItemView 페이지로 이동
    };

    return (
        <div className="item-list-container">
            <h1 className="title">상품 목록</h1>

            {/* 검색창 */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="상품명 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <p className="loading">데이터를 불러오는 중...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>상품 ID</th>
                                <th>상품명</th>
                                <th>가격</th>
                                <th>재고</th>
                                <th>판매 상태</th>
                                <th>상세보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.itemNm}</td>
                                        <td>{item.price.toLocaleString()}원</td>
                                        <td>{item.stockNumber}</td>
                                        <td>{item.itemSellStatus === 'SELL' ? '판매중' : '품절'}</td>
                                        <td>
                                            {/* <button onClick={() => openModal(item)}>상세보기</button> */}
                                            <button onClick={() => handleViewDetail(item.id)}>상세보기</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
{/*
                     */}{/* 상세보기 모달 */}{/*
                    {isModalOpen && (
                        <ItemView itemId={selectedItem} onClose={closeModal} />
                    )} */}

                    {/* 페이징 */}
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
