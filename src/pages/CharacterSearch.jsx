import { useState } from "react";
import "../styles/page.css";

export default function CharacterSearch() {
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    console.log("API Key:", import.meta.env.VITE_LOSTARK_API_KEY);
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/.netlify/functions/lostark?name=${encodeURIComponent(name)}`);


      if (!res.ok) throw new Error("API 응답 실패");

      const data = await res.json();
      console.log("✅ LostArk API 응답:", data); // 🔍 실제 구조 확인
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("❌ API 호출 실패 (CORS 또는 키 문제 가능)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>🧙 캐릭터 검색</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="캐릭터명 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {loading && <p>⏳ 검색 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="character-info">
          {result.CharacterImage && (
            <img
              src={result.CharacterImage}
              alt={result.CharacterName}
              style={{
                width: "240px",
                borderRadius: "10px",
                margin: "1rem auto",
                display: "block",
              }}
            />
          )}
          <h3>[{result.ServerName}] {result.CharacterName}</h3>
          <p>직업: {result.CharacterClassName}</p>
          <p>아이템 레벨: {result.ItemMaxLevel}</p>
          <p>원정대 레벨: {result.ExpeditionLevel}</p>
          <p>길드: {result.GuildName || "없음"}</p>
        </div>
      )}
    </div>
  );
}
