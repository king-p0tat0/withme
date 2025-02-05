import { useEffect, useState } from "react";
import axios from "axios";

const MainNotice = () => {
  const [notices, setNotices] = useState([]); // 초기값 설정

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get("/api/notices"); // 공지사항 API 호출
      const limitedNotices = Array.isArray(response.data)
        ? response.data.slice(0, 5) // 배열일 경우 처리
        : []; // 배열이 아닐 경우 빈 배열 설정
      setNotices(limitedNotices);
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <div>
      <h1>공지사항</h1>
      {notices.length === 0 ? (
        <p>공지사항이 없습니다.</p> // 데이터가 없을 경우 메시지 표시
      ) : (
        <ul>
          {notices.map((notice) => (
            <li key={notice.id}>
              <h3>{notice.title}</h3>
              <p>{notice.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainNotice;
