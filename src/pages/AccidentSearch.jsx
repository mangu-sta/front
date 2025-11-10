import { useState } from "react";
import "../styles/page.css";

export default function AccidentSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`/.netlify/functions/inven?q=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ 검색 실패:", err);
      setError("검색 실패 — 서버 연결 또는 크롤링 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>📰 사사게 검색</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {loading && <p>⏳ 검색 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="search-results">
        {results.length === 0 && !loading && !error ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          results.map((r, i) => (
            <a
              key={i}
              href={r.link}
              className="result-item"
              target="_blank"
              rel="noreferrer"
            >
              {r.title}{" "}
              <span style={{ color: "#888" }}>
                ({r.writer}, {r.date})
              </span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
