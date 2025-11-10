import { useState } from "react";
import "../styles/board.css";

const categories = ["자유게시판", "건의사항", "공략대모집", "길드모집", "깐부모집"];

export default function Community() {
  const [selected, setSelected] = useState("자유게시판");
  const [posts, setPosts] = useState([]);

  const handleWrite = () => {
    const title = prompt("글 제목을 입력하세요:");
    if (title) setPosts([...posts, { id: Date.now(), title, category: selected }]);
  };

  return (
    <div className="page-container">
      <h2>💬 커뮤니티</h2>

      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selected === cat ? "active" : ""}
            onClick={() => setSelected(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="board-controls">
        <button onClick={handleWrite}>✍️ 글쓰기</button>
      </div>

      <div className="post-list">
        {posts.filter((p) => p.category === selected).length === 0 ? (
          <p className="empty">게시글이 없습니다.</p>
        ) : (
          posts
            .filter((p) => p.category === selected)
            .map((p) => (
              <div key={p.id} className="post-item">
                {p.title}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
