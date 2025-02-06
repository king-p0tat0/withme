import React, { useState } from "react";
import PropTypes from "prop-types";

const Comment = ({ comment, onReply, onEdit, onDelete, currentUserId }) => {
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
    onReply(comment.commentId, replyContent); // 부모 댓글 ID와 대댓글 내용 전달
    setReplyContent("");
    setShowReplyForm(false);
  };

  // 댓글 수정 핸들러
  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(comment.commentId, editContent); // 댓글 ID와 수정된 내용 전달
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
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer"
            }}>
            저장
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer",
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

          {/* 작성자만 수정/삭제 버튼 표시 */}
          {currentUserId === comment.userId && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: "#ffc107",
                  color: "#000",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}>
                수정
              </button>
              <button
                onClick={() => onDelete(comment.commentId)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer"
                }}>
                삭제
              </button>
            </>
          )}

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "5px",
              padding: "5px 10px",
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
              cursor: "pointer"
            }}>
            답글 저장
          </button>
        </form>
      )}

      {/* 대댓글 렌더링 */}
      {comment.childComments &&
        comment.childComments.map((childComment) => (
          <Comment
            key={childComment.commentId}
            comment={childComment}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        ))}
    </div>
  );
};

// PropTypes 정의
Comment.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    childComments: PropTypes.arrayOf(
      PropTypes.shape({
        commentId: PropTypes.number.isRequired,
        userId: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string
      })
    )
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Comment;
