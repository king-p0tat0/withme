import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../../constant";

const PaidSurveySelectionPage = () => {
  const [topics, setTopics] = useState([]); // ✅ 문진 주제 목록
  const [selectedTopics, setSelectedTopics] = useState([]); // ✅ 선택된 주제 목록
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // ✅ JWT 포함
    },
    withCredentials: true,
  };

  useEffect(() => {
    if (!user || !user.id) {
      console.error("🚨 유저 정보 없음! 로그인 필요!");
      navigate("/login");
      return;
    }

    console.log("🔍 로그인된 사용자 정보:", user);
    fetchSurveyTopics();
    fetchSelectedTopics(user.id);
  }, [user]);

  const fetchSurveyTopics = () => {
    axios
      .get(`${API_URL}survey-topics/paid/2`, config)
      .then((response) => {
        console.log("유료 문진 주제 목록:", response.data);
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("❌ 문진 주제를 불러오지 못했습니다.", error);
        if (error.response && error.response.status === 401) {
          console.error("🔒 인증 문제! 다시 로그인 필요");
          navigate("/login");
        }
      });
  };

  const fetchSelectedTopics = (userId) => {
    axios
      .get(`${API_URL}user-selected-topics/${userId}`, config)
      .then((response) => {
        console.log("✅ 사용자 선택 주제:", response.data);
        setSelectedTopics(response.data.map((item) => item.topicId));
      })
      .catch((error) => console.error("❌ 사용자 선택 주제 불러오기 실패:", error));
  };

  /**
   * ✅ 개별 체크박스 선택/해제
   */
  const handleTopicChange = (topicId) => {
    setSelectedTopics((prevSelected) =>
      prevSelected.includes(topicId)
        ? prevSelected.filter((id) => id !== topicId)
        : [...prevSelected, topicId]
    );
  };

  /**
   * ✅ 전체 선택/해제 기능
   */
  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map((topic) => topic.topicId));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">유료 문진 검사 주제 선택</h2>
      <p className="mb-2 text-gray-600">문진을 진행할 주제를 선택하세요.</p>

      {/* ✅ 전체 선택 체크박스 */}
      <label className="flex items-center space-x-2 font-bold mb-3">
        <input
          type="checkbox"
          checked={selectedTopics.length === topics.length}
          onChange={handleSelectAll}
        />
        <span>전체 선택</span>
      </label>

      {/* ✅ 주제 선택 목록 */}
      {topics.length === 0 ? (
        <p>❗ 문진 주제를 불러오지 못했습니다.</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.topicId} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={topic.topicId}
                checked={selectedTopics.includes(topic.topicId)}
                onChange={() => handleTopicChange(topic.topicId)}
              />
              <span>{topic.topicName}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ 선택한 주제 목록 */}
      {selectedTopics.length > 0 && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-semibold mb-2">선택한 주제:</h3>
          <ul className="list-disc pl-5">
            {topics
              .filter((topic) => selectedTopics.includes(topic.topicId))
              .map((topic) => (
                <li key={topic.topicId} className="text-blue-600">
                  {topic.topicName}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaidSurveySelectionPage;
