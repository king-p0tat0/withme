import React, { useState, useEffect } from "react";
import { API_URL, SERVER_URL2 } from "../../../constant";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";
import "../../../assets/css/shop/ItemList.css";

export default function ItemList() {
  const [items, setItems] = useState([]); // 상품 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [substances, setSubstances] = useState([]); // 알러지 성분 목록
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // 상품 목록과 알러지 성분 목록 가져오기
  const fetchItemsAndSubstances = async () => {
    setLoading(true);
    setError(null);
    try {
      // 상품 목록 API 호출
      const itemsResponse = await fetchWithAuth(`${API_URL}item/list`);
      const itemsData = await itemsResponse.json();
      console.log("가져온 상품 데이터 : ", itemsData);

      // 알러지 성분 목록 API 호출 (fetchWithAuth 사용)
      const substancesResponse = await fetchWithAuth(
        `${API_URL}substances/list`
      );
      const substancesData = await substancesResponse.json();

      // 기존 상품에 substanceIds 필드가 없는 경우 빈 배열로 처리
      const processedItems = itemsData.map((item) => ({
        ...item,
        substanceIds: item.substanceIds || [] // 기존 상품에 substanceIds 필드 추가
      }));

      setItems(processedItems);
      setSubstances(substancesData);
    } catch (err) {
      console.error("데이터 로딩 에러:", err);
      setError("상품 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //fetchItems(); // 컴포넌트 렌더링 시 상품 목록을 가져옵니다.
    fetchItemsAndSubstances();
  }, []);

  // 검색 딜레이 적용 (0.5초)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery); // 검색어 변경 후 0.5초 후에 디바운스 처리
    }, 500);

    return () => clearTimeout(timer); // 타이머 정리
  }, [searchQuery]);

  // 검색 필터링
  const filteredData = items.filter((item) =>
    item.itemNm.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // 페이지네이션
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 상세보기 페이지로 이동
  const handleViewDetail = (itemId) => {
    navigate(`/item/view/${itemId}`);
  };

  // 알러지 성분 이름 찾기 함수
  const getSubstanceNames = (substanceIds) => {
    if (!substanceIds || substanceIds.length === 0) return "없음";
    return substanceIds
      .map((id) => substances.find((s) => s.substanceId === id)?.name)
      .filter((name) => name)
      .join(", ");
  };

  return (
    <div className="item-list-container">
      <h1 className="title">상품 목록</h1>

      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 변경 시 상태 업데이트
        />
      </div>

      {loading ? (
        <p className="loading">데이터를 불러오는 중...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="item-card-container">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div className="item-card" key={item.id}>
                  {/* 대표 이미지 표시 */}
                    <img
                      src={item.itemImgDtoList && item.itemImgDtoList.length > 0
                                 ? `${SERVER_URL2}${item.itemImgDtoList[0].imgUrl}`
                                 : "/assets/images/favicon.ico" }
                      className="item-image"
                    />


                  <div className="item-info">
                    <h3>{item.itemNm}</h3>
                    <p>가격: {item.price.toLocaleString()}원</p>
                    <p>재고: {item.stockNumber}</p>
                    <p>
                      상태: {item.itemSellStatus === "SELL" ? "판매중" : "품절"}
                    </p>
                    <p>알러지 성분: {getSubstanceNames(item.substanceIds)}</p>
                    <button onClick={() => handleViewDetail(item.id)}>
                      상세보기
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* 페이징 */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}>
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
