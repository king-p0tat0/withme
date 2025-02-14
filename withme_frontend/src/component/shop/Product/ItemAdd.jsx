import React, { useState } from 'react';
import { fetchWithAuth } from '../../../common/fetchWithAuth';
import { API_URL } from '../../../constant';
import '../../../assets/css/shop/ItemCreateForm.css';

export default function ItemForm() {
    const [formData, setFormData] = useState({
        itemNm: '',
        price: '',
        itemDetail: '',
        stockNumber: '',
        itemSellStatus: 'SELL',
        itemImgFile: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, itemImgFile: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'itemImgFile') {
                Array.from(formData.itemImgFile).forEach(file => data.append('itemImgFile', file));
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const response = await fetchWithAuth(`${API_URL}item/new`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                throw new Error('상품 등록에 실패했습니다.');
            }
            alert('상품이 등록되었습니다.');
            // 상품 리스트로 이동
            window.location.href = '/item/list';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="item-create-container">
            <h2>상품 등록</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>상품명:
                    <input type="text" name="itemNm" value={formData.itemNm} onChange={handleChange} required />
                </label>
                <label>가격:
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </label>
                <label>상품 상세 설명:
                    <textarea name="itemDetail" value={formData.itemDetail} onChange={handleChange} required />
                </label>
                <label>재고 수량:
                    <input type="number" name="stockNumber" value={formData.stockNumber} onChange={handleChange} required />
                </label>
                <label>판매 상태:
                    <select name="itemSellStatus" value={formData.itemSellStatus} onChange={handleChange}>
                        <option value="SELL">판매중</option>
                        <option value="SOLD_OUT">품절</option>
                    </select>
                </label>
                <label>상품 이미지:
                    <input type="file" multiple onChange={handleFileChange} />
                </label>
                <button type="submit" disabled={loading}>{loading ? '등록 중...' : '상품 등록'}</button>
            </form>
        </div>
    );
}
