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
  Alert
} from "@mui/material";
import { Pagination } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import useWebSocket from "../../hook/useWebSocket";
import img2 from "../../image/img2.png";

const DoctorMessageList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { messages, loading } = useSelector((state) => state.messages);
  const [replyContent, setReplyContent] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReplying, setIsReplying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // WebSocket 연결
  const socket = useWebSocket(user);

  // 페이지별 메시지 가져오기
  const fetchMessagesByPage = useCallback(async (page) => {
    try {
      const response = await fetchWithAuth(`${API_URL}messages/${user.id}?page=${page - 1}&size=8`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setMessages(data.content));
        setTotalPages(data.totalPages);
      } else {
        showPopup("메시지를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error('메시지 로드 중 오류:', error);
      showPopup("네트워크 오류가 발생했습니다.");
    }
  }, [user.id, dispatch]);

  useEffect(() => {
    fetchMessagesByPage(currentPage);
  }, [fetchMessagesByPage, currentPage]);

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setIsReplying(false);
    if (message && message.id && !message.read) {
      dispatch(markMessageAsRead(message.id));
      fetchWithAuth(`${API_URL}messages/read?messageId=${message.id}`, {
        method: "POST"
      }).catch(error => {
        console.error('메시지 읽음 처리 실패:', error);
        showPopup("메시지 읽음 처리 중 오류 발생");
      });
    }
  };

  const showPopup = (msg) => {
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async (messageId) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}messages/${messageId}?userId=${user.id}&isSender=false`,
        {
          method: "DELETE"
        }
      );

      if (response.ok) {
        showPopup("메시지가 삭제되었습니다.");
        dispatch(setMessages(messages.filter(msg => msg.id !== messageId))); // 즉시 상태 업데이트
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        fetchMessagesByPage(currentPage); // 서버에서 다시 데이터 가져오기
      } else {
        showPopup("메시지 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error('삭제 중 오류:', error);
      showPopup("메시지 삭제 중 오류가 발생했습니다.");
    }
  };

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
        const newMessage = await response.json();
        dispatch(addMessage(newMessage));
        showPopup("답변이 성공적으로 전송되었습니다.");
        setReplyContent("");
        setIsReplying(false);
        fetchMessagesByPage(currentPage);
      } else {
        showPopup("답변 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error('답장 전송 실패:', error);
      showPopup("네트워크 오류로 답장 전송 실패");
    }
  };

  const columns = [
    {
      field: 'senderName',
      headerName: '보낸 사람',
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'content',
      headerName: '내용',
      flex: 2,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => (
        <div style={{
          cursor: 'pointer',
          color: params.row.read ? '#666' : '#000',
          fontWeight: params.row.read ? 'normal' : 'bold'
        }}>
          {params.value.substring(0, 50)}...
        </div>
      )
    },
    {
      field: 'regTime',
      headerName: '시간',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: '삭제',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(params.row.id);
          }}
          sx={{
            color: '#E75480',
            '&:hover': {
              backgroundColor: '#FFE4E8'
            }
          }}
        >
          <DeleteIcon />
        </Button>
      )
    }
  ];

  if (loading) return (
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

      <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, mb: 2 }}>
        <Paper sx={{
          width: '50%',
          backgroundColor: '#FFF5F0',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <DataGrid
            rows={messages}
            columns={columns}
            pageSize={8}
            pagination
            paginationMode="server"
            rowCount={totalPages * 8}
            page={currentPage - 1}
            onPageChange={(newPage) => setCurrentPage(newPage + 1)}
            rowsPerPageOptions={[8]}
            onRowClick={(params) => handleOpenMessage(params.row)}
            disableSelectionOnClick
            paginationModel={{
              pageSize: 8,
              page: currentPage - 1,
            }}
            pageSizeOptions={[8]}
            components={{
              Pagination: () => (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    color="primary"
                    shape="rounded"
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
              ),
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderColor: '#FFE4E8'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#FFE4E8',
                borderBottom: 'none'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#FFF0F0'
              }
            }}
          />
        </Paper>

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