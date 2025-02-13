import React, { useState, useEffect } from 'react';
import '../../../assets/css/shop/ItemView.css';
import { API_URL } from '../../../constant';
import { fetchWithAuth } from '../../../common/fetchWithAuth';
import { useParams } from 'react-router-dom';

export default function ItemView({ user }) {
    const { itemId } = useParams();
    const [item, setItem] = useState(null); // 상품 상세 정보를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    console.log("받아온 user : " , user);

    // 상품 상세 정보를 가져오는 함수
    useEffect(() => {
        // 상품 id가 없으면 종료
        if (!itemId) return;

        const fetchItemDetail = async () => {
            try {
                const response = await fetch(`${API_URL}item/view/${itemId}`); // 서버에서 상품 상세 정보 요청
                if (!response.ok) {
                    throw new Error('상품 정보를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                console.log("상품 상세정보 호출 :", data);
                setItem(data); // 응답 받은 데이터로 상태 업데이트
                setLoading(false);
            } catch (error) {
                setError(error.message); // 에러 상태 업데이트
                setLoading(false);
            }
        };

        fetchItemDetail(); // 상품 상세 정보를 요청
    }, [itemId]); // itemId가 변경될 때마다 실행

    if (loading) {
        return <div>로딩 중...</div>; // 로딩 중일 때 표시할 UI
    }

    if (error) {
        return <div>{error}</div>; // 에러 발생 시 표시할 UI
    }

    if (!item) {
        return <div>상품을 찾을 수 없습니다.</div>; // item이 없을 경우 표시할 UI
    }

    const handleDelete = async () => {
        // 삭제 요청 처리
        try {
            const response = await fetchWithAuth(`${API_URL}item/delete/${itemId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('상품이 삭제되었습니다.');
                // 삭제 후 리스트로 이동 추가
            } else {
                alert('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>상품 상세 정보</h2>
                <p><strong>상품명:</strong> {item.itemNm}</p>
                <p><strong>가격:</strong> {item.price.toLocaleString()}원</p>
                <p><strong>재고:</strong> {item.stockNumber}</p>
                <p><strong>상태:</strong> {item.itemSellStatus === 'SELL' ? '판매중' : '품절'}</p>
                <p><strong>설명:</strong> {item.itemDetail}</p>

                <button>장바구니 담기</button>

                {/* 관리자인 경우에만 수정 및 삭제 버튼을 표시 */}
                {user && user.roles && user.roles.includes('ROLE_ADMIN') && (
                    <>
                        <button onClick={() => alert('상품 수정 기능을 구현하세요.')}>상품 수정</button>
                        <button onClick={handleDelete}>상품 삭제</button>
                    </>
                )}
            </div>
        </div>
    );
}
