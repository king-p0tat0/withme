import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Button, Pagination } from "@mui/material";
import TabPanel from "../elements/TabPanel";

const categories = [
  "전체",
  "펫푸드",
  "질문/꿀팁",
  "펫일상",
  "펫수다",
  "행사/정보"
];

const PostList = () => {
  const { isLoggedIn } = useSelector((state) => state.auth); // Redux에서 로그인 여부 가져오기
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10
  });

  const navigate = useNavigate();

  // 게시글 목록 가져오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${API_URL}posts?page=${paginationModel.page - 1}&size=${
          paginationModel.pageSize
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      const data = await response.json();

      // API 응답 데이터 확인 (디버깅용)
      console.log("API 응답 데이터:", data);
      console.log("posts:", data.posts);

      // dtoList 대신 posts 사용
      setPosts(data.posts || []);
      setFilteredPosts(data.posts || []);
      setTotalRows(data.total || 0);
    } catch (error) {
      console.error("게시글 목록 가져오기 실패:", error.message);
      alert("게시글 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [paginationModel]);

  // 카테고리 변경 처리
  const handleCategoryChange = (event, newValue) => {
    setActiveCategoryIndex(newValue);
    const selectedCategory = categories[newValue];
    if (selectedCategory === "전체") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.postCategory === selectedCategory)
      );
    }
  };

  // 페이지네이션 처리
  const handlePageChange = (event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  // 글 작성 버튼 클릭 처리
  const handleWritePostClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      //navigate("/login"); // 로그인 페이지로 이동
    } else {
      window.scrollTo(0, 0);
      navigate("/posts/new"); // 글 작성 페이지로 이동
    }
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (postId) => {
    window.scrollTo(0, 0);
    navigate(`/posts/${postId}`); // Navigate to the post view page with the post ID
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>커뮤니티</h1>

      {/* MUI Tabs */}
      <Tabs
        value={activeCategoryIndex}
        onChange={handleCategoryChange}
        aria-label="posts_category_tabs">
        {categories.map((postCategory) => (
          <Tab key={postCategory} label={postCategory} />
        ))}
      </Tabs>

      {/* TabPanels */}
      {categories.map((category) => (
        <TabPanel
          key={category}
          value={activeCategoryIndex}
          index={categories.indexOf(category)}>
          <ul>
            {filteredPosts.map((post) => (
              <li
                key={post.id}
                style={{ marginBottom: "20px", cursor: "pointer" }}
                onClick={() => handlePostClick(post.id)}>
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt="게시물 썸네일"
                    className="w-full h-48 object-cover"
                  />
                )}
                <h2>{post.content || "내용 없음"}</h2>
                <div>
                  <span>조회수: {post.views}</span>
                  <div className="text-sm text-gray-600">
                    {post.updateTime && post.updateTime !== post.regTime ? (
                      <div>
                        수정일:{" "}
                        {new Date(post.updateTime).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    ) : (
                      <div>
                        작성일:{" "}
                        {post.regTime &&
                          new Date(post.regTime).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                      </div>
                    )}
                  </div>
                </div>
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
