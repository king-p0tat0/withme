import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../constant';
import { fetchWithAuth } from '../../../common/fetchWithAuth';
import Payment from '../Order/SubscriptionPayment'; // 구독 결제 컴포넌트
import '../../../assets/css/shop/CartList.css';

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionItem, setSubscriptionItem] = useState(null);  // 구독 상품 정보
    const [merchantId, setMerchantId] = useState("");  // 가맹점 UID 상태
    const [orderId, setOrderId] = useState(null); // 주문 ID 상태
    const [isOrdering, setIsOrdering] = useState(false); // 주문 후 결제 UI 전환 상태

    // 구독 상품 정보를 하드코딩하여 로딩
    useEffect(() => {
        const fetchSubscriptionItem = async () => {
            try {
                const itemId = 1;  // 하드코딩된 구독 상품 ID
                const response = await fetchWithAuth(`${API_URL}item/view/${itemId}`);
                if (!response.ok) {
                    throw new Error('구독 상품 정보를 불러오지 못했습니다.');
                }
                const data = await response.json();
                console.log("구독 상품 정보 : ", data);
                setSubscriptionItem(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // 가맹점 UID 가져오기
        const fetchMerchantId = () => {
            const id = import.meta.env.VITE_PORTONE_MERCHANT_ID;
            setMerchantId(id);
        };

        fetchSubscriptionItem();
        fetchMerchantId(); // 최초 1회 실행
    }, []);

    // 구독 상품 주문하기
    const handleOrder = async () => {
        if (!subscriptionItem) {
            alert('구독 상품 정보가 없습니다.');
            return;
        }

        const orderData = {
            itemId: subscriptionItem.id,
            count: 1,
        };

        try {
            const response = await fetchWithAuth(`${API_URL}cart/subscriptions/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('주문 실패');
            }

            // 서버에서 응답받은 데이터(주문 ID)를 저장
            const orderId = await response.json();
            setOrderId(orderId);
            setIsOrdering(true); // 주문 후 결제 화면으로 전환
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!subscriptionItem) return <div>상품 정보가 없습니다.</div>;

    return (
        <div className="cart-container">
            {isOrdering && orderId ? (
                <Payment
                    merchantId={merchantId}
                    subscriptionItem={subscriptionItem}
                    orderId={orderId}
                />
            ) : (
                <>
                    <h2>구독 상품</h2>
                    <div className="cart-item">
                        <div className="cart-item-info">
                            <h4>{subscriptionItem.itemNm}</h4>
                            <p>가격: {subscriptionItem.price.toLocaleString()}원</p>
                            <button onClick={handleOrder}>구독 상품 주문하기</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
