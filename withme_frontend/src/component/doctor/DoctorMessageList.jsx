import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import { API_URL } from "../../constant";
import { setMessages, markMessageAsRead, addMessage } from "../../redux/messageSlice";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useWebSocket from "../../hook/useWebSocket";
import img2 from "../../image/img2.png";

const DoctorMessageList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.messages);
  const [localMessages, setLocalMessages] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReplying, setIsReplying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // 웹소켓 연결
  const socket = useWebSocket(user);

  // 페이지별 메시지 가져오기
  const fetchMessagesByPage = useCallback(async (page) => {
    try {
      const response = await fetchWithAuth(`${API_URL}messages/${user.id}?page=${page - 1}&size=8`);
      if (response.ok) {
        const data = await response.json();
        setLocalMessages(data.content);
        setTotalPages(data.totalPages);
      } else {
        showPopup("메시지를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error('메시지 로드 중 오류:', error);
      showPopup("네트워크 오류가 발생했습니다.");
    }
  }, [user.id]);

  // 컴포넌트 마운트 시 메시지 로드
  useEffect(() => {
    fetchMessagesByPage(currentPage);
  }, [fetchMessagesByPage, currentPage]);

  // 메시지 열기 핸들러
  const handleOpenMessage = useCallback((message) => {
    if (!message) return;

    setSelectedMessage(message);
    setIsReplying(false);

    if (message.id && !message.read) {
      dispatch(markMessageAsRead(message.id));
      fetchWithAuth(`${API_URL}messages/read?messageId=${message.id}`, {
        method: "POST"
      }).catch(error => {
        console.error('메시지 읽음 처리 실패:', error);
        showPopup("메시지 읽음 처리 중 오류 발생");
      });
    }
  }, [dispatch]);

  // 팝업 메시지 표시
  const showPopup = (msg) => {
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 메시지 삭제 핸들러
  const handleDelete = async (messageId) => {
      try {
        // DELETE 요청 보내기
        const response = await fetchWithAuth(
          `${API_URL}messages/${messageId}?userId=${user.id}&isSender=false`,
          {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          // 성공적으로 삭제되었을 때
          showPopup("메시지가 삭제되었습니다.");

          // 현재 선택된 메시지가 삭제된 메시지인 경우 선택 해제
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(null);
          }

          // 로컬 메시지 목록에서 삭제된 메시지 제거
          setLocalMessages(prevMessages =>
            prevMessages.filter(msg => msg.id !== messageId)
          );

          // 현재 페이지의 마지막 메시지를 삭제한 경우 이전 페이지로 이동
          if (localMessages.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            // 현재 페이지 데이터 다시 로드
            await fetchMessagesByPage(currentPage);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          showPopup(errorData.message || "메시지 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error('삭제 중 오류:', error);
        showPopup("메시지 삭제 중 오류가 발생했습니다.");
      }
  };

  // 답장 전송 핸들러
  const handleReply = async () => {
    if (!replyContent.trim()) {
      showPopup("답장 내용을 입력해주세요.");
      return;
    }

    if (!selectedMessage || !selectedMessage.senderId) {
      showPopup("선택된 메시지가 없습니다.");
      return;
    }

    const replyMessage = {
      senderId: user.id,
      receiverId: selectedMessage.senderId,
      content: replyContent,
      messageType: "answer",
      senderRole: "ROLE_DOCTOR",
      receiverRole: "ROLE_VIP"
    };

    try {
      const response = await fetchWithAuth(`${API_URL}messages/send`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyMessage),
      });

      if (response.ok) {
        showPopup("답변이 성공적으로 전송되었습니다.");
        setReplyContent("");
        setIsReplying(false);
        await fetchMessagesByPage(currentPage);
      } else {
        showPopup("답변 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error('답장 전송 실패:', error);
      showPopup("네트워크 오류로 답장 전송 실패");
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#FFFBF8'
      }}>
        <CircularProgress sx={{ color: '#E75480' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 100px)',
      maxWidth: 1200,
      margin: 'auto',
      backgroundColor: '#FFFBF8',
      p: 3,
      borderRadius: 2
    }}>
      {/* 헤더 */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4,
        borderBottom: "2px solid #FFB6C1",
        pb: 2
      }}>
        <img src={img2} alt="Pet" style={{ width: "120px", marginRight: "20px" }} />
        <Typography variant="h4" sx={{
          fontWeight: "bold",
          color: "#E75480",
          backgroundColor: "#FFF5F0",
          px: 3,
          py: 2,
          borderRadius: "15px",
        }}>
          📬 받은 메시지 목록
        </Typography>
      </Box>

      {/* 메인 컨텐츠 */}
      <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, mb: 2 }}>
        {/* 메시지 목록 */}
        <Paper sx={{
          width: '50%',
          backgroundColor: '#FFF5F0',
          borderRadius: 2,
          p: 2
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#FFE4E8' }}>보낸 사람</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#FFE4E8' }}>내용</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#FFE4E8' }}>시간</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#FFE4E8' }}>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localMessages.map((message) => (
                <TableRow
                  key={message.id}
                  onClick={() => handleOpenMessage(message)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#FFF0F0' }
                  }}
                >
                  <TableCell align="center">{message.senderName}</TableCell>
                  <TableCell align="left" sx={{
                    color: message.read ? '#666' : '#000',
                    fontWeight: message.read ? 'normal' : 'bold'
                  }}>
                    {message.content.substring(0, 50)}...
                  </TableCell>
                  <TableCell align="center">
                    {new Date(message.regTime).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();  // 기본 이벤트 방지
                        e.stopPropagation(); // 이벤트 버블링 방지
                        handleDelete(message.id);
                      }}
                      sx={{
                        color: '#E75480',
                        '&:hover': { backgroundColor: '#FFE4E8' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={2}
              boundaryCount={2}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#E75480',
                  '&.Mui-selected': {
                    backgroundColor: '#FFE4E8'
                  }
                }
              }}
            />
          </Box>
        </Paper>

        {/* 메시지 상세 보기 */}
        <Paper sx={{
          width: '50%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFF5F0',
          borderRadius: 2
        }}>
          {selectedMessage ? (
            <>
              <Typography variant="h6" sx={{
                mb: 2,
                color: '#E75480',
                fontWeight: 'bold'
              }}>
                선택된 메시지
              </Typography>
              <Box sx={{
                mb: 2,
                flexGrow: 1,
                overflowY: 'auto',
                backgroundColor: '#FFFFFF',
                p: 2,
                borderRadius: 1
              }}>
                <Typography variant="body1">{selectedMessage.content}</Typography>
                <Typography variant="caption" sx={{
                  display: 'block',
                  mt: 1,
                  color: '#666'
                }}>
                  보낸 사람: {selectedMessage.senderName} |
                  시간: {new Date(selectedMessage.regTime).toLocaleString()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => setIsReplying(true)}
                fullWidth
                sx={{
                  mb: 2,
                  backgroundColor: '#E75480',
                  '&:hover': {
                    backgroundColor: '#FF69B4'
                  }
                }}
              >
                답변하기
              </Button>
              {isReplying && (
                <>
                  <TextField
                    multiline
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    fullWidth
                    placeholder="답장 내용을 입력하세요."
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                          borderColor: '#FFB6C1'
                        },
                        '&:hover fieldset': {
                          borderColor: '#E75480'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E75480'
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleReply}
                    fullWidth
                    sx={{
                      backgroundColor: '#E75480',
                      '&:hover': {
                        backgroundColor: '#FF69B4'
                      }
                    }}
                  >
                    💬 답장 전송
                  </Button>
                </>
              )}
            </>
          ) : (
            <Typography variant="body1" sx={{ color: '#666' }}>
              메시지를 선택하세요.
            </Typography>
          )}
        </Paper>
      </Box>

      {/* 스낵바 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorMessageList;