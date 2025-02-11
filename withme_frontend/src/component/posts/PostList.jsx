import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Button, Pagination } from "@mui/material";
import TabPanel from "../elements/TabPanel";
import { fetchWithAuth, fetchWithoutAuth } from "../../utils/fetchWithAuth";

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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // 현재 활성화된 카테고리 인덱스
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 사용자 ID
  const [totalRows, setTotalRows] = useState(0); // 전체 게시글 수
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10
  }); // 페이지네이션 상태
  const navigate = useNavigate();


  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchCurrentUser(); // 사용자 정보 가져오기
    fetchPosts(); // 게시글 목록 가져오기
  }, [paginationModel]);

  /**
   * 현재 로그인한 사용자 정보 가져오기
   * 로그인하지 않은 경우 currentUserId를 null로 설정
   */
  const fetchCurrentUser = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/auth/me`);
      const data = await response.json();
      setCurrentUserId(data.userId);
    } catch (error) {
      console.warn("사용자 정보 가져오기 실패:", error.message);
      setCurrentUserId(null); // 로그인하지 않은 상태로 설정
    }
  };

  /**
   * 게시글 데이터 가져오기 (인증 불필요)
   */
  const fetchPosts = async () => {
    const { page, pageSize } = paginationModel;

    try {
      const response = await fetchWithoutAuth(
        `${API_URL}/posts?page=${page - 1}&size=${pageSize}`
      );
      const data = await response.json();
      setPosts(data.dtoList || []);
      setFilteredPosts(data.dtoList || []);
      setTotalRows(data.total || 0);
    } catch (error) {
      console.error("게시글 목록 가져오는 중 오류 발생:", error.message);
      alert("게시글 목록 가져오기 실패: 네트워크 또는 서버 오류");
    }
  };

  /**
   * 카테고리 변경 시 필터링 처리
   */
  const handleCategoryChange = (event, newValue) => {
    setActiveCategoryIndex(newValue);
    const selectedCategory = categories[newValue];
    if (selectedCategory === "전체") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.category === selectedCategory)
      );
    }
  };

  /**
   * 페이지네이션 변경 처리
   */
  const handlePageChange = (event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  /**
   * 글 작성 버튼 클릭 처리
   */
  const handleWritePostClick = () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      navigate("/posts/new");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>커뮤니티</h1>

      {/* MUI Tabs */}
      <Tabs
        value={activeCategoryIndex}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="posts-category-tabs">
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>

      {/* TabPanels */}
      {categories.map((category, index) => (
        <TabPanel key={index} value={activeCategoryIndex} index={index}>
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
                    <Button
                      onClick={() => navigate(`/posts/edit/${post.postId}`)}
                      style={{
                        padding: "8px",
                        marginRight: "10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        borderRadius: "5px"
                      }}>
                      수정
                    </Button>
                    <Button
                      onClick={() => deletePost(post.postId)}
                      style={{
                        padding: "8px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        borderRadius: "5px"
                      }}>
                      삭제
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {filteredPosts.length === 0 && (
            <p>해당 카테고리에 게시물이 없습니다.</p>
          )}
        </TabPanel>
      ))}

      {/* 글 작성 버튼 */}
      <Button
        onClick={handleWritePostClick}
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}>
        글 작성하기
      </Button>

      {/* 페이지네이션 */}
      <Pagination
        count={Math.ceil(totalRows / paginationModel.pageSize)}
        page={paginationModel.page}
        onChange={handlePageChange}
        color="primary"
        size="small"
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default PostList;
