import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateNotice = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/notices", formData);
      alert("공지사항이 등록되었습니다.");
      navigate("/"); // 등록 후 리스트 페이지로 이동
    } catch (error) {
      console.error("공지사항 등록 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>공지사항 등록</h1>
      <div>
        <label>제목</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>내용</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>카테고리</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <button type="submit">등록</button>
    </form>
  );
};

export default CreateNotice;
