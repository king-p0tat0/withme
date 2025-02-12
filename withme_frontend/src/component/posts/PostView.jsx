import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import Comment from "./Comment";
import {
  PrimaryButton,
  DeleteButton,
  OutlineButton
} from "../elements/CustomComponents";
import { display } from "@mui/system";

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Redux에서 로그인 상태 가져오기
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  // 게시글 불러오기
  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_URL}posts/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("게시글 가져오기 실패:", error.message);
    }
  };

  // 댓글 불러오기
  const fetchComments = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}posts/${id}/comments`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }
      const data = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error("댓글 가져오기 실패:", error.message);
      alert("댓글을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async () => {
    if (!isLoggedIn) {
      alert("해당 권한이 없습니다.");
      //navigate("/login");
      return;
    }

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetchWithAuth(`${API_URL}posts/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`삭제 실패: ${response.status} ${errorData}`);
      }

      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate("/posts");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      if (error.message.includes("403")) {
        alert("삭제 권한이 없습니다.");
      } else if (error.message.includes("404")) {
        alert("존재하지 않는 게시글입니다.");
      } else {
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 새 댓글 작성
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}posts/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: newComment,
          postId: Number(id),
          userName: user.name
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      await fetchComments(); // 댓글 목록 새로고침
      setNewComment(""); // 입력창 초기화
      setShowCommentForm(false); // 폼 숨기기
      alert("댓글이 성공적으로 작성되었습니다.");
    } catch (error) {
      console.error("댓글 작성 실패:", error.message);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (parentCommentId, replyContent) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}posts/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: replyContent,
          postId: Number(id),
          parentCommentId: parentCommentId,
          userName: user.name, // 사용자 이름 추가
          userId: user.id // 사용자 ID 추가
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      await fetchComments(); // 댓글 목록 새로고침
      alert("대댓글이 성공적으로 작성되었습니다.");
    } catch (error) {
      console.error("대댓글 작성 실패:", error.message);
      alert("대댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정
  const handleEditSubmit = async (commentId, editedContent) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${API_URL}posts/${id}/comments/${commentId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            content: editedContent,
            postId: Number(id),
            userId: user.id, // 추가
            userName: user.name // 추가
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      await fetchComments(); // 댓글 목록 새로고침
      alert("댓글이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 실패:", error.message);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteSubmit = async (commentId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${API_URL}posts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            userId: user.id
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      await fetchComments(); // 댓글 목록 새로고침
      alert("댓글이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error.message);
      if (error.message.includes("403")) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // 댓글 폼 토글
  const toggleCommentForm = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      //navigate("/login");
      return;
    }
    setShowCommentForm(!showCommentForm);
  };

  // 로딩 중
  if (!post) return <p>게시글 로딩 중...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* 게시글 정보 */}
      <h1>{post.title || "제목 없음"}</h1>
      <p>{post.content || "내용 없음"}</p>
      <p>
        <strong>카테고리:</strong> {post.postCategory || "미분류"}
      </p>
      <strong>
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
      </strong>

      {/* 댓글 섹션 */}
      <div style={{ marginTop: "30px" }}>
        <h2>댓글</h2>

        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReplySubmit}
              onEdit={handleEditSubmit} // onEdit 핸들러 추가
              onDelete={handleDeleteSubmit} // onDelete 핸들러 추가
              currentUserId={user?.id} // 현재 사용자 ID 전달
              currentUserName={user?.name} // 현재 사용자 이름 전달
            />
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}

        <div>
          {/* 댓글 달기 버튼 (폼이 닫혀있을 때만 표시) */}
          {!showCommentForm && (
            <PrimaryButton onClick={toggleCommentForm}>댓글달기</PrimaryButton>
          )}

          {/* 댓글 입력 폼 */}
          {showCommentForm && (
            <form
              onSubmit={handleNewCommentSubmit}
              style={{ marginTop: "10px" }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성하세요"
                rows="3"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px"
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <OutlineButton type="submit">댓글저장</OutlineButton>
                <DeleteButton type="button" onClick={toggleCommentForm}>
                  취소
                </DeleteButton>
              </div>
            </form>
          )}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* 목록보기 버튼 */}
        <button onClick={() => navigate("/posts")}>목록보기</button>
        {/* 게시글 수정 및 삭제 버튼 */}
        {user?.id === post.userId && (
          <div>
            {/* 수정 버튼 */}
            <button onClick={() => navigate(`/posts/${id}/edit`)}>수정</button>

            {/* 삭제 버튼 */}
            <button onClick={handleDeletePost}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostView;
