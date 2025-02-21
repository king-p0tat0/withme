import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL, SERVER_URL2 } from "../../../constant";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";
import "../../../assets/css/shop/ItemList.css";

export default function ItemList() {
  // 상태 변수 선언
  const [items, setItems] = useState([]); // 상품 목록을 저장하는 상태 변수
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태를 나타내는 상태 변수
  const [error, setError] = useState(null); // 에러 메시지를 저장하는 상태 변수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 저장하는 상태 변수
  const [searchQuery, setSearchQuery] = useState(""); // 검색어를 저장하는 상태 변수
  const [debouncedQuery, setDebouncedQuery] = useState(""); // 디바운스된 검색어를 저장하는 상태 변수
  const [substances, setSubstances] = useState([]); // 알러지 성분 목록을 저장하는 상태 변수
  const [userPets, setUserPets] = useState([]); // 사용자의 반려동물 정보를 저장하는 상태 변수
  const [recommendedItems, setRecommendedItems] = useState([]); // 추천 상품 목록을 저장하는 상태 변수
  const [allergySummary, setAllergySummary] = useState(new Set()); // 알러지 요약 정보를 저장하는 상태 변수

  // React Hooks
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const { user } = useSelector((state) => state.auth); // Redux 스토어에서 사용자 정보를 가져오는 useSelector 훅

  // 페이지당 상품 수
  const itemsPerPage = 10;

  // 상품 목록, 알러지 성분 목록, 사용자의 반려동물 정보 가져오기
  const fetchAllData = async () => {
    setLoading(true); // 로딩 상태를 true로 설정
    setError(null); // 에러 메시지를 null로 초기화

    try {
      // 1. 상품 리스트 가져오기 (토큰 없이 가져오기)
      const itemsResponse = await fetch(`${API_URL}item/list`);
      const itemsData = await itemsResponse.json();

      // 2. 상품 데이터 처리
      const processedItems = itemsData.map((item) => ({
        ...item,
        substanceIds: item.substanceIds || [] // substanceIds가 없으면 빈 배열로 초기화
      }));
      setItems(processedItems); // 상품 목록 상태 업데이트

      // 3. 성분 리스트 가져오기 (fetchWithAuth 사용)
      try {
        const substancesResponse = await fetch(`${API_URL}substances/list`);
        if (substancesResponse.ok) {
          const substancesData = await substancesResponse.json();
          setSubstances(substancesData); // 알러지 성분 목록 상태 업데이트
        } else {
          console.error("성분 리스트 로딩 실패");
          setSubstances([]); // 알러지 성분 목록을 빈 배열로 설정
        }
      } catch (substanceError) {
        console.error("성분 리스트 로딩 중 오류:", substanceError);
        setSubstances([]); // 알러지 성분 목록을 빈 배열로 설정
      }

      // 4. 로그인 상태이고 관리자가 아닌 경우에만 추가 처리
      if (user?.id && !user.roles?.includes("ROLE_ADMIN")) {
        try {
          // 4.1. 펫 정보 가져오기 (토큰 필요)
          const petsResponse = await fetchWithAuth(
            `${API_URL}pets/user/${user.id}`
          );
          const petsData = await petsResponse.json();

          // 4.2. 펫 정보가 배열이 아니면 content 속성에서 가져오기
          const petContent = Array.isArray(petsData)
            ? petsData
            : petsData.content || [];

          setUserPets(petContent); // 사용자 반려동물 정보 상태 업데이트

          // 4.3. 알러지 정보 처리
          const allAllergies = new Set();
          petContent.forEach((pet) => {
            if (pet.allergies && Array.isArray(pet.allergies)) {
              pet.allergies.forEach((allergy) => {
                if (allergy.substanceId) {
                  allAllergies.add(allergy.substanceId); // 알러지 요약 정보에 추가
                }
              });
            }
          });
          setAllergySummary(allAllergies); // 알러지 요약 정보 상태 업데이트

          // 4.4. 추천 상품 필터링
          const recommended = processedItems.filter(
            (item) => item.substanceIds?.some((id) => allAllergies.has(id)) // 알러지 성분에 해당하는 상품 필터링
          );
          setRecommendedItems(recommended); // 추천 상품 목록 상태 업데이트
        } catch (petError) {
          console.error("펫 정보 로딩 에러:", petError);
          setUserPets([]); // 사용자 반려동물 정보를 빈 배열로 설정
          setRecommendedItems([]); // 추천 상품 목록을 빈 배열로 설정
        }
      }
    } catch (err) {
      console.error("데이터 로딩 에러:", err);
      setError(err.message || "데이터를 가져오는 데 실패했습니다."); // 에러 메시지 상태 업데이트
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정
    }
  };

  // useEffect Hook: 컴포넌트가 마운트될 때와 user.id가 변경될 때 fetchAllData 함수를 실행
  useEffect(() => {
    fetchAllData(); // 상품 리스트 로드
  }, [user?.id]); // user.id가 변경될 때마다 실행

  // useEffect Hook: 검색어 딜레이 적용 (0.5초)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery); // 0.5초 후에 디바운스된 검색어 설정
    }, 500);
    return () => clearTimeout(timer); // 타이머 해제
  }, [searchQuery]);

  // 검색 필터링
  const filteredData = items.filter(
    (item) => item.itemNm.toLowerCase().includes(debouncedQuery.toLowerCase()) // 상품 이름에 검색어가 포함되어 있는지 확인
  );

  // 페이지네이션
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // 총 페이지 수 계산
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // 현재 페이지에 해당하는 상품 목록 추출

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // 현재 페이지 번호 업데이트
    }
  };

  // 상세보기 핸들러
  const handleViewDetail = (itemId) => {
    navigate(`/item/view/${itemId}`); // 상세보기 페이지로 이동
  };

  // 알러지 성분 이름 찾기 함수
  const getSubstanceNames = (substanceIds) => {
    // substanceIds가 없거나 배열이 아니거나 비어있거나 substances가 없거나 배열이 아닌 경우
    if (
      !substanceIds ||
      !Array.isArray(substanceIds) ||
      substanceIds.length === 0 ||
      !substances ||
      !Array.isArray(substances)
    ) {
      return "없음"; // "없음" 반환
    }

    // substanceIds에 해당하는 알러지 성분 이름을 찾아서 쉼표로 구분된 문자열로 반환
    const names = substanceIds
      .map((id) => {
        const substance = substances.find((s) => s.substanceId === id); // substanceId에 해당하는 알러지 성분 찾기
        return substance ? substance.name : null; // 알러지 성분이 있으면 이름 반환, 없으면 null 반환
      })
      .filter(Boolean) // null 값 제거
      .join(", "); // 쉼표로 구분된 문자열로 변환

    return names || "없음"; // 결과가 없으면 "없음" 반환
  };

  // 렌더링
  return (
    <div className="item-list-container">
      {/* 추천 상품 섹션 */}
      {user && !user.roles?.includes("ROLE_ADMIN") ? ( // 로그인 상태이고 관리자가 아닌 경우
        userPets && userPets.length > 0 ? ( // 펫이 등록된 경우
          <div className="recommended-section">
            <h2 className="section-title">
              {user.name}님의 반려동물을 위한 추천 상품
            </h2>
            <div className="item-card-container">
              {recommendedItems.map(
                (
                  item // 추천 상품 목록을 순회하며 상품 카드 생성
                ) => (
                  <div className="item-card recommend" key={item.id}>
                    {item.itemImgDtoList &&
                      item.itemImgDtoList.length > 0 && ( // 상품 이미지 목록이 있는 경우
                        <img
                          src={`${SERVER_URL2}${item.itemImgDtoList[0].imgUrl}`} // 첫 번째 이미지 URL 설정
                          alt={item.itemNm} // 대체 텍스트 설정
                          className="item-image" // CSS 클래스 설정
                        />
                      )}
                    <div className="item-info">
                      <h3>{item.itemNm}</h3>
                      <p>가격: {item.price.toLocaleString()}원</p>
                      <p>재고: {item.stockNumber}</p>
                      <p>
                        상태:{" "}
                        {item.itemSellStatus === "SELL" ? "판매중" : "품절"}
                      </p>
                      <p>
                        효과 있는 알러지: {getSubstanceNames(item.substanceIds)}
                      </p>
                      <button onClick={() => handleViewDetail(item.id)}>
                        상세보기
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          // 로그인 상태이지만 펫이 등록되지 않은 경우
          <div className="register-pet-section">
            <h2>맞춤 상품 추천을 받아보세요!</h2>
            <p>
              반려동물을 등록하시면 알러지를 고려한 맞춤 상품을 추천해드립니다.
            </p>
            <button
              className="register-pet-button"
              onClick={() => navigate(`/mypage/${user.id}`)}>
              반려동물 등록하러 가기
            </button>
          </div>
        )
      ) : null}

      {/* 전체 상품 목록 섹션 */}
      <h2 className="section-title">전체 상품 목록</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* 로딩, 에러, 상품 목록 렌더링 */}
      {loading ? (
        <p className="loading">데이터를 불러오는 중...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="item-card-container">
            {currentData.length > 0 ? ( // 상품 목록이 있는 경우
              currentData.map(
                (
                  item // 상품 목록을 순회하며 상품 카드 생성
                ) => (
                  <div className="item-card" key={item.id}>
                    {item.itemImgDtoList &&
                      item.itemImgDtoList.length > 0 && ( // 상품 이미지 목록이 있는 경우
                        <img
                          src={`${SERVER_URL2}${item.itemImgDtoList[0].imgUrl}`} // 첫 번째 이미지 URL 설정
                          alt={item.itemNm} // 대체 텍스트 설정
                          className="item-image" // CSS 클래스 설정
                        />
                      )}
                    <div className="item-info">
                      <h3>{item.itemNm}</h3>
                      <p>가격: {item.price.toLocaleString()}원</p>
                      <p>재고: {item.stockNumber}</p>
                      <p>
                        상태:{" "}
                        {item.itemSellStatus === "SELL" ? "판매중" : "품절"}
                      </p>
                      <p>
                        효과 있는 알러지: {getSubstanceNames(item.substanceIds)}
                      </p>
                      <button onClick={() => handleViewDetail(item.id)}>
                        상세보기
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>

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
