import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  ListItemText
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utils/fetchWithAuth"; // 절대 변경 금지 ( utils )
import { API_URL } from "../../../constant";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/shop/ItemAdd.css";

const ItemRegistration = () => {
  const [item, setItem] = useState({
    itemNm: "",
    price: "",
    itemDetail: "",
    stockNumber: "",
    itemSellStatus: "SELL",
    substanceIds: [] // 알러지 성분 ID 배열
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [substances, setSubstances] = useState([]);

  const navigate = useNavigate();

  // 알러지 성분 목록 불러오기
  useEffect(() => {
    const fetchSubstances = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}substances/list`);
        if (response.ok) {
          const data = await response.json();
          //console.log("Fetched substances:", data);
          setSubstances(data);
        }
      } catch (error) {
        console.error("알러지 성분 목록 불러오기 실패:", error);
      }
    };

    fetchSubstances();
  }, []);

  // 알러지 성분 선택 핸들러
  const handleSubstanceChange = (event) => {
    const { value } = event.target;
    console.log("Selected substance IDs:", value);
    setItem((prevItem) => ({
      ...prevItem,
      substanceIds: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  // 파일 삭제 함수
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    const newPreviews = imagePreviews.filter((_, idx) => idx !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력 유효성 검사
    if (!item.itemNm) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!item.price) {
      alert("판매가를 입력해주세요.");
      return;
    }
    if (images.length === 0) {
      alert("상품 이미지를 최소 한 개 등록해야 합니다.");
      return;
    }

    // 상품 데이터 준비
    const itemData = {
      ...item,
      price: Number(item.price),
      stockNumber: Number(item.stockNumber || 0),
      substanceIds: Array.isArray(item.substanceIds) ? item.substanceIds : []
    };

    // 전송 전 데이터 확인 로그
    //console.log("전송할 상품 데이터:", itemData);
    console.log("선택된 알러지 성분:", itemData.substanceIds);

    const formData = new FormData();

    // itemFormDto를 JSON 문자열로 변환하여 추가
    formData.append(
      "itemFormDto",
      new Blob([JSON.stringify(itemData)], { type: "application/json" })
    );

    // 이미지 파일 추가
    images.forEach((image) => {
      formData.append("itemImgFile", image);
    });

    try {
      const response = await fetchWithAuth(`${API_URL}item/new`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("상품이 성공적으로 등록되었습니다.");
        navigate("/item/list");
      } else {
        const errorText = await response.text();
        console.error("서버 응답:", errorText);
        alert(`상품 등록 실패: ${errorText}`);
      }
    } catch (error) {
      console.error("상품 등록 중 오류 발생:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom>
        📦 간단 등록
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        쇼핑몰에 상품을 진행하는데 필요한 기본정보를 입력합니다.
      </Typography>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <TextField
            label="상품명"
            variant="outlined"
            fullWidth
            required
            name="itemNm"
            value={item.itemNm}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <TextField
            label="판매가"
            variant="outlined"
            fullWidth
            required
            name="price"
            value={item.price}
            onChange={handleChange}
            placeholder="0"
            type="number"
          />
        </div>

        <div className="form-group">
          <Typography variant="body1">상품 이미지 등록</Typography>
          <div className="image-upload">
            <label className="upload-box">
              {/* 텍스트 숨기기 */}
              {imagePreviews.length === 0 && (
                <span>📷 + 등록</span> // 프리뷰 이미지가 없을 때만 텍스트 표시
              )}

              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              {/* 이미지 미리보기 및 X 버튼 */}
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="image-preview-container"
                  style={{ position: "relative" }}>
                  <img
                    src={preview}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover" // 이미지가 박스를 꽉 채우도록 설정
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      width: "5px",
                      height: "5px",
                      top: "-15px", // 버튼을 이미지의 상단으로 이동
                      right: "5px", // 버튼을 이미지의 우측으로 이동
                      background: "transparent",
                      border: "none",
                      color: "red",
                      fontSize: "20px",
                      cursor: "pointer",
                      zIndex: 10 // X 버튼이 이미지 위에 오도록 설정
                    }}>
                    ✖
                  </button>
                </div>
              ))}
            </label>
          </div>
          <Typography
            variant="body2"
            color="textSecondary"
            className="info-text">
            권장 이미지: 500px × 500px / 5M 이하 / gif, png, jpg(jpeg)
          </Typography>
        </div>

        <div className="form-group">
          <TextField
            label="상품 수량"
            variant="outlined"
            fullWidth
            name="stockNumber"
            value={item.stockNumber}
            onChange={handleChange}
            placeholder="상품의 수량을 입력합니다."
          />
        </div>

        <div className="form-group">
          <TextField
            label="상품 상세 설명"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            name="itemDetail"
            value={item.itemDetail}
            onChange={handleChange}
            placeholder="상품의 상세한 설명을 입력하세요."
          />
        </div>
        {/* 알러지 성분 선택 */}
        <div className="form-group">
          <FormControl fullWidth>
            <InputLabel>알러지 성분</InputLabel>
            <Select
              multiple
              value={item.substanceIds}
              onChange={handleSubstanceChange}
              renderValue={(selected) =>
                selected
                  .map(
                    (id) => substances.find((s) => s.substanceId === id)?.name
                  )
                  .filter(Boolean)
                  .join(", ")
              }>
              {substances.map((substance) => (
                <MenuItem
                  key={substance.substanceId}
                  value={substance.substanceId}>
                  <Checkbox
                    checked={item.substanceIds.includes(substance.substanceId)}
                  />
                  <ListItemText primary={substance.name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>알러지 성분을 선택하세요</FormHelperText>
          </FormControl>
        </div>
        <div className="form-group">
          <FormControl fullWidth required>
            <InputLabel id="sell-status-label">판매 상태</InputLabel>
            <Select
              labelId="sell-status-label"
              name="itemSellStatus"
              value={item.itemSellStatus}
              onChange={handleChange}
              label="판매 상태">
              <MenuItem value="SELL">판매중</MenuItem>
              <MenuItem value="SOLD_OUT">품절</MenuItem>
              <MenuItem value="SUBSCRIP">구독상품</MenuItem>
            </Select>
            <FormHelperText>판매 상태를 선택하세요</FormHelperText>
          </FormControl>
        </div>

        <div className="button-container">
          <Button variant="contained" color="primary" type="submit">
            상품 등록
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemRegistration;
