import React, { useState, useEffect } from 'react';
import { API_URL, SERVER_URL2 } from '../../../constant';
import { fetchWithAuth } from '../../../common/fetchWithAuth';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/shop/CartList.css';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 목록
    const navigate = useNavigate();

    // 장바구니 목록 조회
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}cart/list`);
                if (!response.ok) {
                    throw new Error('장바구니 정보를 불러오지 못했습니다.');
                }
                const data = await response.json();
                console.log("받아온 장바구니 목록 : ", data);
                setCartItems(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    // 상품 수량 변경
    const handleQuantityChange = async (cartItemId, count) => {
        if (count < 1) {
            alert('수량은 1개 이상이어야 합니다.');
            return;
        }
        try {
            const response = await fetchWithAuth(`${API_URL}cart/cartItem/${cartItemId}?count=${count}`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error('수량 변경 실패');
            }
            setCartItems(prevItems => prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, count } : item
            ));
            console.log(`수량 변경: 상품ID ${cartItemId}, 새로운 수량 ${count}`);
        } catch (error) {
            alert(error.message);
        }
    };

    // 상품 삭제
    const handleDelete = async (cartItemId) => {
        try {
            const response = await fetchWithAuth(`${API_URL}cart/cartItem/${cartItemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('삭제 실패');
            }
            setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
            console.log(`삭제된 상품 ID: ${cartItemId}`);
        } catch (error) {
            alert(error.message);
        }
    };

    // 장바구니 선택된 항목만 주문하기
    const handleOrder = async () => {
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해 주세요.');
            return;
        }
        const orderData = { cartOrderItems: selectedItems.map(itemId => {
            const item = cartItems.find(item => item.cartItemId === itemId);
            console.log("선택된 상품:", item);
            return { cartItemId: item.cartItemId, count: item.count };
        })};

        console.log("주문할 데이터: ", orderData); // 선택된 항목과 수량 확인

        try {
            const response = await fetchWithAuth(`${API_URL}cart/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error('주문 실패');
            }
            // 서버에서 응답받은 데이터(주문 ID)를 콘솔에 출력
            const orderId = await response.json();
            console.log("반환받은 주문ID : ", orderId);  // 서버에서 반환된 주문ID

            navigate(`/orders/${orderId}`,{
                state: {orderData}
                });

        } catch (error) {
            alert(error.message);
        }
    };

    // 체크박스 변경
    const handleSelectItem = (cartItemId) => {
        setSelectedItems(prevSelectedItems => {
            if (prevSelectedItems.includes(cartItemId)) {
                return prevSelectedItems.filter(id => id !== cartItemId); // 이미 선택된 아이템은 제외
            } else {
                return [...prevSelectedItems, cartItemId]; // 선택되지 않은 아이템은 추가
            }
        });
    };

    // 전체 선택/해제
    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]); // 이미 모든 항목이 선택되었으면 모두 해제
        } else {
            setSelectedItems(cartItems.map(item => item.cartItemId)); // 모든 항목을 선택
        }
    };

    // 선택된 상품들의 주문 가격 합산 계산
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.includes(item.cartItemId)) {
                return total + (item.price * item.count);
            }
            return total;
        }, 0);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (cartItems.length === 0) return <div>장바구니가 비어 있습니다.</div>;

    return (
        <div className="cart-container">
            <h2>장바구니</h2>

            {/* 전체 선택 체크박스 */}
            <div>
                <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                />
                <label>전체 선택</label>
            </div>

            {cartItems.map(item => (
                <div key={item.cartItemId} className="cart-item">
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.cartItemId)}
                        onChange={() => handleSelectItem(item.cartItemId)}
                    />
                    <img src={SERVER_URL2 + item.imgUrl} alt={item.itemNm} className="cart-item-image" />
                    <div className="cart-item-info">
                        <h4>{item.itemNm}</h4>
                        <p>가격: {item.price.toLocaleString()}원</p>
                        <div>
                            <button onClick={() => handleQuantityChange(item.cartItemId, item.count - 1)}>-</button>
                            <span>{item.count}</span>
                            <button onClick={() => handleQuantityChange(item.cartItemId, item.count + 1)}>+</button>
                        </div>
                        <p>주문 가격: {(item.price * item.count).toLocaleString()}원</p>
                        <button onClick={() => handleDelete(item.cartItemId)}>삭제</button>
                    </div>
                </div>
            ))}

            {/* 최종 주문 가격 */}
            <div>
                <h3>최종 주문 가격: {calculateTotalPrice().toLocaleString()}원</h3>
            </div>

            <button className="order-button" onClick={handleOrder}>주문하기</button>
        </div>
    );
}
