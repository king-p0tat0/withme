import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import axios from "axios";

const categories = [
  "전체",
  "펫푸드",
  "질문/꿀팁",
  "펫일상",
  "펫수다",
  "행사/정보"
]; // 카테고리 목록

const PostList = () => {
  const [posts, setPosts] = useState([]); // 전체 게시글
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글
  const [activeCategory, setActiveCategory] = useState("전체"); // 현재 활성화된 카테고리

  // 게시글 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${API_URL}/posts`) // API_URL 상수 사용
      .then((response) => {
        setPosts(response.data);
        setFilteredPosts(response.data); // 기본적으로 전체 게시글 표시
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // 카테고리 변경 시 필터링 처리
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "전체") {
      setFilteredPosts(posts); // 전체 게시글 표시
    } else {
      setFilteredPosts(posts.filter((post) => post.category === category)); // 선택된 카테고리의 게시글만 표시
    }
  };

  return (
    <div>
      <h1>커뮤니티</h1>
      {/* 카테고리 탭 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                activeCategory === category ? "#007BFF" : "#f0f0f0",
              color: activeCategory === category ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px"
            }}>
            {category}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.postId} style={{ marginBottom: "20px" }}>
            <h2>{post.postTitle}</h2>
            <p>{post.postContent}</p>
            <p>
              <strong>카테고리:</strong> {post.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
