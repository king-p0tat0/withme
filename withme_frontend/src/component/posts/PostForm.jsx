import React, { useState, useEffect } from "react";
import { API_URL } from "../../constant";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PostForm = () => {
  const [post, setPost] = useState({
    postTitle: "",
    postContent: "",
    category: ""
  }); // 게시글 데이터 상태
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 ID 가져오기

  // 수정 모드일 경우 기존 데이터 가져오기
  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}`);
      if (response.status === 200) {
        setPost(response.data);
      } else {
        alert("게시글 정보를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("게시글 정보 가져오는 중 오류 발생:", error.message);
    }
  };

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // 수정 모드
        await axios.put(`${API_URL}/posts/${id}`, post);
        alert("게시글이 수정되었습니다.");
      } else {
        // 등록 모드
        await axios.post(`${API_URL}/posts`, post);
        alert("게시글이 등록되었습니다.");
      }
      navigate("/posts"); // 게시글 목록으로 이동
    } catch (error) {
      console.error("게시글 저장 중 오류 발생:", error.message);
      alert("저장 실패");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{id ? "게시글 수정" : "게시글 등록"}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>제목:</label>
          <input
            type="text"
            name="postTitle"
            value={post.postTitle}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>내용:</label>
          <textarea
            name="postContent"
            value={post.postContent}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>카테고리:</label>
          <select
            name="category"
            value={post.category}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}>
            <option value="">카테고리 선택</option>
            <option value="펫푸드">펫푸드</option>
            <option value="질문/꿀팁">질문/꿀팁</option>
            <option value="펫일상">펫일상</option>
            <option value="펫수다">펫수다</option>
            <option value="행사/정보">행사/정보</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer"
          }}>
          저장
        </button>
        <button
          type="button"
          onClick={() => navigate("/posts")}
          style={{
            padding: "10px",
            marginLeft: "10px",
            backgroundColor: "#6c757d",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer"
          }}>
          취소
        </button>
      </form>
    </div>
  );
};

export default PostForm;
