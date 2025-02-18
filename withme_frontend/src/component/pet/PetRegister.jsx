import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  FormLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { API_URL } from "../../constant";
import { getImageUrl } from "../../utils/imageUtils";

const PetRegister = ({ petData = null, onSubmitSuccess = () => {} }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "M",
    healthConditions: "",
    neutered: false,
    imageFile: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // 초기 데이터 로드
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (petData) {
      setFormData({
        name: petData.name || "",
        breed: petData.breed || "",
        age: petData.age ? String(petData.age) : "",
        weight: petData.weight ? String(petData.weight) : "",
        gender: petData.gender || "M",
        healthConditions: petData.healthConditions || "",
        neutered: petData.neutered || false,
        imageFile: null
      });

      if (petData.imageUrl) {
        setImagePreview(getImageUrl(petData.imageUrl));
      }
    }
  }, [petData, user, navigate]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const url = petData
        ? `${API_URL}pets/${petData.petId}`
        : `${API_URL}pets/register`;
      const method = petData ? "PUT" : "POST";

      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("breed", formData.breed);
      dataToSend.append("age", formData.age);
      dataToSend.append("weight", formData.weight);
      dataToSend.append("gender", formData.gender);
      dataToSend.append("userId", user.id);

      if (formData.neutered !== undefined) {
        dataToSend.append("neutered", formData.neutered);
      }
      if (formData.healthConditions) {
        dataToSend.append("healthConditions", formData.healthConditions);
      }
      if (formData.imageFile) {
        dataToSend.append("image", formData.imageFile);
      }

      const response = await fetch(url, {
        method,
        body: dataToSend,
        credentials: "include", // 쿠키 포함
        headers: {
          // Authorization 헤더 제거하고 쿠키로 전달
        }
      });

      if (response.ok) {
        const result = await response.json();
        onSubmitSuccess(result);
        alert(
          petData
            ? "반려동물 정보가 수정되었습니다."
            : "반려동물이 등록되었습니다."
        );
        navigate(`/mypage/${user.id}`);
      } else if (response.status === 401) {
        // 로그인 페이지로 리다이렉트
        const currentPath = petData
          ? `/mypage/pet/${petData.petId}`
          : "/mypage/pet/register";
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        navigate("/login", {
          state: { returnUrl: currentPath }
        });
      } else {
        const errorText = await response.text();
        console.error("펫 등록/수정 오류:", errorText);
        setError("펫 등록/수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("펫 등록/수정 중 오류:", error);
      setError("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <Card sx={{ maxWidth: "400px", margin: "auto" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {petData ? "펫 정보 수정" : "펫 등록"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* 이미지 업로드 */}
            <FormControl>
              <FormLabel>반려동물 사진</FormLabel>
              <Box sx={{ textAlign: "center", mt: "8px" }}>
                {imagePreview && (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}>
                  사진 {imagePreview ? "변경" : "추가"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </FormControl>

            {/* 이름 */}
            <TextField
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />

            {/* 품종 */}
            <FormControl>
              <FormLabel>품종</FormLabel>
              <TextField
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="품종"
                variant="outlined"
                fullWidth
                margin="dense"
              />
            </FormControl>

            {/* 나이 & 체중 */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="나이"
                name="age"
                type="text" // type을 text로 설정
                value={formData.age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    // 숫자만 허용
                    handleInputChange(e);
                  }
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // 모바일 환경에서도 숫자 키패드 표시
                required
                fullWidth
              />

              <TextField
                label="체중 (kg)"
                name="weight"
                type="text" // type을 text로 설정
                value={formData.weight}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    // 숫자만 허용
                    handleInputChange(e);
                  }
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // 모바일 환경에서도 숫자 키패드 표시
                required
                fullWidth
              />
            </Box>

            {/* 성별 */}
            <FormControl>
              <FormLabel>성별</FormLabel>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="button"
                  variant={formData.gender === "M" ? "contained" : "outlined"}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, gender: "M" }))
                  }>
                  수컷
                </Button>
                <Button
                  type="button"
                  variant={formData.gender === "F" ? "contained" : "outlined"}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, gender: "F" }))
                  }>
                  암컷
                </Button>
              </Box>
            </FormControl>

            {/* 건강 상태 */}
            <TextField
              label="건강 상태"
              name="healthConditions"
              value={formData.healthConditions}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            {/* 중성화 여부 */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.neutered}
                  onChange={handleCheckboxChange}
                  name="neutered"
                />
              }
              label="중성화 여부"
            />

            {/* 버튼 */}
            <Box sx={{ display: "flex", gap: "8px", mt: 2 }}>
              <Button type="submit" variant="contained" fullWidth>
                {petData ? "수정 완료" : "등록"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/mypage/${user.id}`)}
                fullWidth>
                취소
              </Button>
            </Box>
          </Box>
        </form>

        {/* 오류 메시지 */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default PetRegister;
