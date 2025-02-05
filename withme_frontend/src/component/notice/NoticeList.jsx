import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton.jsx";
import "../../assets/css//notice/NoticeList.css";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get("/api/notices");
      setNotices(response.data);
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <div>
      <h1>공지사항 리스트</h1>
      <Link to="/create">공지사항 등록</Link>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
            <p>카테고리: {notice.category}</p>
            <Link to={`/edit/${notice.id}`}>수정</Link>
            <DeleteButton id={notice.id} onDelete={fetchNotices} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeList;
