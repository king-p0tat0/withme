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
import { API_URL, SERVER_URL2 } from "../../../constant";
import { useNavigate, useParams } from "react-router-dom"; // 상품 ID를 가져오기 위해 useParams 사용
import "../../../assets/css/shop/ItemAdd.css";

const ItemEdit = () => {
  const [item, setItem] = useState({
    itemNm: "",
    price: "",
    itemDetail: "",
    stockNumber: "",
    itemSellStatus: "SELL",
    itemImgIds: [],
    substanceIds: [], // 알러지 성분 ID 배열
    itemImgDtoList: []
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [substances, setSubstances] = useState([]); // 알러지 성분 목록 상태

  const navigate = useNavigate();
  const { itemId } = useParams(); // URL에서 itemId를 가져옵니다.

  console.log("itemId : ", itemId);

  // 알러지 성분 목록과 상품 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 알러지 성분 목록 불러오기
        const substancesResponse = await fetchWithAuth(
          `${API_URL}substances/list`
        );
        if (substancesResponse.ok) {
          const substancesData = await substancesResponse.json();
          //console.log("Fetched substances:", substancesData);
          setSubstances(substancesData);
        }

        // 상품 정보 불러오기
        const itemResponse = await fetchWithAuth(
          `${API_URL}item/view/${itemId}`
        );
        if (itemResponse.ok) {
          const itemData = await itemResponse.json();
          console.log("Fetched item data:", itemData);

          setItem({
            ...itemData,
            substanceIds: itemData.substanceIds || [] // 알러지 성분 ID 설정
          });

          // 기존 이미지 미리보기 설정
          if (itemData.itemImgDtoList) {
            const previews = itemData.itemImgDtoList.map((img) => img.imgUrl);
            setImagePreviews(previews);
          }
        }
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        alert("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

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
    console.log("이미지 변경 후 URL : ", previewUrls);
    setImagePreviews(previewUrls);
  };

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

    // 상품 데이터 준비
    const itemData = {
      ...item,
      price: Number(item.price),
      stockNumber: Number(item.stockNumber || 0),
      substanceIds: Array.isArray(item.substanceIds) ? item.substanceIds : []
    };

    // 전송 전 데이터 확인
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

    // FormData 내용 확인 (안전하게 처리)
    console.log("FormData 내용:");
    for (let [key, value] of formData.entries()) {
      if (key === "itemFormDto") {
        // Blob을 텍스트로 읽어서 출력
        const reader = new FileReader();
        reader.onload = () => {
          console.log("itemFormDto 내용:", reader.result);
        };
        reader.readAsText(value);
      } else if (value instanceof File) {
        console.log(key, `File: ${value.name}`);
      } else {
        console.log(key, value);
      }
    }

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

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중에 표시할 메시지
  }

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom>
        📦 상품 수정
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        상품 정보를 수정합니다.
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
            placeholder="상품명"
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
              {imagePreviews.length === 0 && <span>📷 + 등록</span>}

              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="image-preview-container"
                  style={{ position: "relative" }}>
                  <img
                    src={
                      preview.includes("http")
                        ? preview
                        : `${SERVER_URL2}${preview}`
                    }
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      width: "5px",
                      height: "5px",
                      top: "-15px",
                      right: "5px",
                      background: "transparent",
                      border: "none",
                      color: "red",
                      fontSize: "20px",
                      cursor: "pointer",
                      zIndex: 10
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
            placeholder="상품 수량"
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
            placeholder="상품 설명"
          />
        </div>
        {/* 알러지 성분 선택 섹션 */}
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
            </Select>
            <FormHelperText>판매 상태를 선택하세요</FormHelperText>
          </FormControl>
        </div>

        <div className="button-container">
          <Button variant="contained" color="primary" type="submit">
            상품 수정
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemEdit;
