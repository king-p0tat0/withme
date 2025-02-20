import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../constant";

export default function SearchResults() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("query");

  useEffect(() => {
    if (!searchQuery) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}items/search?keyword=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "검색 중 오류가 발생했습니다.");
        }

        setItems(result);
      } catch (error) {
        console.error("검색 오류:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="search-results-container">
      <h2>'{searchQuery}' 검색 결과</h2>

      {loading ? (
        <p>검색 중...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="item-grid">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="item-card" key={item.id || item.itemId || index}>
                <div className="item-info">
                  <h3>{item.name || item.itemNm}</h3>
                  <p>{item.description || item.itemDetail}</p>
                  <p className="price">{item.price?.toLocaleString()}원</p>
                </div>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
