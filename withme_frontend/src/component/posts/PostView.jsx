import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// 댓글 컴포넌트
const Comment = ({ comment, onReply, onEdit }) => {
  const [showReplyForm, setShowReplyForm] = useState(false); // 대댓글 입력 폼 표시 여부
  const [replyContent, setReplyContent] = useState(""); // 대댓글 내용
  const [isEditing, setIsEditing] = useState(false); // 댓글 수정 모드 여부
  const [editContent, setEditContent] = useState(comment.content); // 수정 중인 댓글 내용

  // 날짜 포맷 함수
  const formatDate = (date) => {
    return new Date(date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // 대댓글 작성 핸들러
  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(comment.id, replyContent); // 부모 댓글 ID와 대댓글 내용 전달
    setReplyContent("");
    setShowReplyForm(false);
  };

  // 댓글 수정 핸들러
  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(comment.id, editContent); // 댓글 ID와 수정된 내용 전달
    setIsEditing(false);
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "10px" }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "5px"
            }}>
            저장
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "5px",
              marginLeft: "10px"
            }}>
            취소
          </button>
        </form>
      ) : (
        <>
          <p>
            <strong>{comment.author}</strong>: {comment.content}
          </p>
          <p style={{ fontSize: "12px", color: "#555" }}>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt ? (
              <>[수정일자]: {formatDate(comment.updatedAt)}</>
            ) : (
              <>작성일자: {formatDate(comment.createdAt)}</>
            )}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px"
            }}>
            수정
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
            답글
          </button>
        </>
      )}

      {/* 대댓글 입력 폼 */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: "10px" }}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 작성하세요..."
            rows="3"
            style={{ width: "100%", padding: "10px" }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              borderRadius: "5px",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
              marginTop: "5px"
            }}>
            답글 저장
          </button>
        </form>
      )}

      {/* 대댓글 렌더링 */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onEdit={onEdit}
          />
        ))}
    </div>
  );
};

// 메인 PostView 컴포넌트
const PostView = () => {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const [post, setPost] = useState(null); // 게시글 데이터 상태
  const [comments, setComments] = useState([]); // 댓글 데이터 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 내용 상태
  const navigate = useNavigate();

  // 게시글 데이터 가져오기
  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      if (response.status === 200) {
        setPost(response.data);
      }
    } catch (error) {
      console.error("게시글 가져오기 실패:", error.message);
    }
  };

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}/comments`);
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("댓글 가져오기 실패:", error.message);
    }
  };

  // 새 댓글 작성 핸들러
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/posts/${id}/comments`, {
        content: newComment
      });
      if (response.status === 201) {
        fetchComments(); // 댓글 목록 갱신
        setNewComment(""); // 입력 필드 초기화
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error.message);
    }
  };

  // 대댓글 작성 핸들러
  const handleReplySubmit = async (parentId, replyContent) => {
    try {
      await axios.post(`${API_URL}/posts/${id}/comments/${parentId}/replies`, {
        content: replyContent
      });
      fetchComments(); // 댓글 목록 갱신
    } catch (error) {
      console.error("대댓글 작성 실패:", error.message);
    }
  };

  // 댓글 수정 핸들러
  const handleEditSubmit = async (commentId, updatedContent) => {
    try {
      await axios.put(`${API_URL}/posts/${id}/comments/${commentId}`, {
        content: updatedContent
      });
      fetchComments(); // 댓글 목록 갱신
    } catch (error) {
      console.error("댓글 수정 실패:", error.message);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  if (!post) return <p>게시글 로딩 중...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{post.postTitle}</h1>
      <p>{post.postContent}</p>
      <p>
        <strong>카테고리:</strong> {post.category}
      </p>

      {/* 댓글 섹션 */}
      <div style={{ marginTop: "30px" }}>
        <h2>댓글</h2>

        {/* 새 댓글 작성 폼 */}
        <form
          onSubmit={handleNewCommentSubmit}
          style={{ marginBottom: "20px" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            rows="3"
            style={{ width: "100%", padding: "10px" }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "5px",
              padding: "10px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px"
            }}>
            댓글 저장
          </button>
        </form>

        {/* 댓글 렌더링 */}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReplySubmit}
            onEdit={handleEditSubmit}
          />
        ))}
      </div>

      {/* 목록으로 돌아가기 버튼 */}
      <button
        onClick={() => navigate("/posts")}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#6c757d",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default PostView;
