import "../styles/page.css";

export default function RaidInfo() {
  const contents = [
    { name: "카멘", desc: "------------------" },
    { name: "일리아칸", desc: "------------------" },
    { name: "발탄", desc: "------------------" },
    { name: "비아키스", desc: "------------------" },
    { name: "쿠크세이튼", desc: "------------------" },
    { name: "아브렐슈드", desc: "------------------" },
    { name: "에키드나", desc: "------------------" },
  ];

  return (
    <div className="page-container">
      <h2>⚔️ 콘텐츠 정보</h2>
      <p className="page-desc">콘텐츠별 보상 및 정보 확인 가능</p>
      <div className="content-grid">
        {contents.map((c) => (
          <div key={c.name} className="content-card">
            <h3>{c.name}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
