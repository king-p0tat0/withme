import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { fetchWithAuth } from "../../../common/fetchWithAuth";
import { API_URL } from "../../../constant";
import { useNavigate } from "react-router-dom";

const ItemRegistration = () => {
  const [item, setItem] = useState({
    itemNm: '',
    price: '',
    itemDetail: '',
    stockNumber: '',
    itemSellStatus: 'SELL'
  });
  const [images, setImages] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prevItem => ({
      ...prevItem,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('itemFormDto', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    images.forEach((image, index) => {
      formData.append('itemImgFile', image);
    });

    try {
      const response = await fetchWithAuth(`${API_URL}item/new`, {
        method: 'POST',
        body: formData,

      });

      if (response.ok) {
        alert('상품이 성공적으로 등록되었습니다.');
        // 성공 후 리스트로 이동
        navigate("/item/list");
      } else {
        const errorData = await response.json();
        alert(`상품 등록 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error('상품 등록 중 오류 발생:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="itemNm" value={item.itemNm} onChange={handleChange} placeholder="상품명" required />
      <input type="number" name="price" value={item.price} onChange={handleChange} placeholder="가격" required />
      <textarea name="itemDetail" value={item.itemDetail} onChange={handleChange} placeholder="상품 상세 설명" required />
      <input type="number" name="stockNumber" value={item.stockNumber} onChange={handleChange} placeholder="재고 수량" required />
      <select name="itemSellStatus" value={item.itemSellStatus} onChange={handleChange}>
        <option value="SELL">판매중</option>
        <option value="SOLD_OUT">품절</option>
      </select>
      <input type="file" multiple onChange={handleImageChange} />
      <button type="submit">상품 등록</button>
    </form>
  );
};

export default ItemRegistration;
