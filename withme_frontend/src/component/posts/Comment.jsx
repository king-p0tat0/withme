import React, { useState } from "react";
import PropTypes from "prop-types";

const Comment = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  currentUserName,
  depth = 0
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isHovered, setIsHovered] = useState(false);

  // 대댓글 작성 핸들러
  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
  };

  // 댓글 수정 핸들러
  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        marginLeft: `${depth * 20}px`,
        borderLeft: depth > 0 ? "2px solid #e0e0e0" : "none",
        paddingLeft: depth > 0 ? "10px" : "0",
        marginBottom: "10px",
        position: "relative"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "10px" }}
            required
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit">저장</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ position: "relative" }}>
            <div>
              <strong>{comment.userName}</strong>
              <p>{comment.content}</p>
              <div className="text-sm text-gray-600">
                {comment.updateTime &&
                comment.updateTime !== comment.regTime ? (
                  <div>
                    수정일:{" "}
                    {new Date(comment.updateTime).toLocaleString("ko-KR", {
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
                    {comment.regTime &&
                      new Date(comment.regTime).toLocaleString("ko-KR", {
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

            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  display: "flex",
                  gap: "10px",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  padding: "5px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                {currentUserId === comment.userId && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer"
                      }}>
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc3545",
                        cursor: "pointer"
                      }}>
                      삭제
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#28a745",
                    cursor: "pointer"
                  }}>
                  답글
                </button>
              </div>
            )}
          </div>

          {showReplyForm && (
            <form
              onSubmit={handleReplySubmit}
              style={{
                marginTop: "10px",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "5px"
              }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 작성하세요"
                rows="3"
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                required
              />
              <button type="submit">답글 저장</button>
            </form>
          )}
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((childComment) => (
            <Comment
              key={childComment.id}
              comment={childComment}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    author: PropTypes.string,
    content: PropTypes.string.isRequired,
    regTime: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        userName: PropTypes.string.isRequired,
        author: PropTypes.string,
        content: PropTypes.string.isRequired,
        regTime: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  currentUserId: PropTypes.number.isRequired,
  //currentUserName: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  depth: PropTypes.number
};

export default Comment;
