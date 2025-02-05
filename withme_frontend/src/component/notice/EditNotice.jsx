import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditNotice = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotice();
  }, []);

  const fetchNotice = async () => {
    try {
      const response = await axios.get(`/api/notices/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/notices/${id}`, formData);
      alert("공지사항이 수정되었습니다.");
      navigate("/"); // 수정 후 리스트 페이지로 이동
    } catch (error) {
      console.error("공지사항 수정 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>공지사항 수정</h1>
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
      <button type="submit">수정</button>
    </form>
  );
};

export default EditNotice;
