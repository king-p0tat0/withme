import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 사용자 ID
  const [totalRows, setTotalRows] = useState(0); // 전체 게시글 수
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  }); // 페이지네이션 상태
  const navigate = useNavigate();

  /**
   * 컴포넌트가 마운트될 때 한 번 실행되며, paginationModel 또는 posts가 변경될 때도 실행됩니다.
   */
  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, [paginationModel]);

  // 현재 로그인한 사용자 정보 가져오기 (예: /api/auth/me 엔드포인트)
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      if (response.status === 200) {
        setCurrentUserId(response.data.userId);
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error.message);
      alert("로그인 정보가 필요합니다.");
      navigate("/login");
    }
  };

  // 게시글 데이터 가져오기
  const fetchPosts = async () => {
    const { page, pageSize } = paginationModel; // 현재 페이지와 페이지 크기

    try {
      const response = await axios.get(
        `${API_URL}/posts?page=${page}&size=${pageSize}`
      );
      if (response.status === 200) {
        const data = response.data; // 서버에서 받아온 데이터
        setPosts(data.dtoList || []); // 전체 게시글 저장
        setFilteredPosts(data.dtoList || []); // 기본적으로 전체 게시글 표시
        setTotalRows(data.total || 0); // 전체 게시글 수 저장
      } else {
        console.error("게시글 목록 불러오기 실패:", response.status);
        alert(`게시글 목록 불러오기 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error("게시글 목록 가져오는 중 오류 발생:", error.message);
      alert("게시글 목록 가져오기 실패: 네트워크 또는 서버 오류");
    }
  };

  // 카테고리 변경 시 필터링 처리
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "전체") {
      setFilteredPosts(posts); // 전체 게시글 표시
    } else {
      setFilteredPosts(posts.filter((post) => post.category === category)); // 선택된 카테고리의 게시글만 표시
    }
  };

  // 게시글 삭제
  const deletePost = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`${API_URL}/posts/${id}`);
        if (response.status === 204) {
          alert("게시글이 삭제되었습니다.");
          fetchPosts(); // 목록 갱신
        } else {
          alert("게시글 삭제 실패");
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error.message);
        alert("게시글 삭제 실패: 네트워크 또는 서버 오류");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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
            {/* 작성자만 수정/삭제 버튼 표시 */}
            {currentUserId === post.userId && (
              <>
                <button
                  onClick={() => navigate(`/posts/edit/${post.postId}`)}
                  style={{
                    padding: "8px",
                    marginRight: "10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}>
                  수정
                </button>
                <button
                  onClick={() => deletePost(post.postId)}
                  style={{
                    padding: "8px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}>
                  삭제
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 페이지네이션 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px"
        }}>
        <button
          disabled={paginationModel.page === 0}
          onClick={() =>
            setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          style={{
            padding: "10px",
            marginRight: "10px",
            cursor: paginationModel.page === 0 ? "not-allowed" : "pointer"
          }}>
          이전 페이지
        </button>
        <button
          disabled={
            (paginationModel.page + 1) * paginationModel.pageSize >= totalRows
          }
          onClick={() =>
            setPaginationModel((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          style={{
            padding: "10px",
            cursor:
              (paginationModel.page + 1) * paginationModel.pageSize >= totalRows
                ? "not-allowed"
                : "pointer"
          }}>
          다음 페이지
        </button>
      </div>
    </div>
  );
};

export default PostList;
