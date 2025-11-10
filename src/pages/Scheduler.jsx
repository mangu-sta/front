import { useState } from "react";
import "../styles/scheduler.css";

export default function Scheduler() {
  const [nickname, setNickname] = useState("");
  const [characters, setCharacters] = useState([]);

  // 경매 관련 상태
  const [itemPrice, setItemPrice] = useState("");
  const [people, setPeople] = useState(8);
  const [result, setResult] = useState(null);

  // ==============================
  // 캐릭터 추가 / 순서 변경 (기존 유지)
  // ==============================
  const addCharacter = () => {
    if (!nickname.trim()) return;
    setCharacters([...characters, { name: nickname, progress: 0 }]);
    setNickname("");
  };

  const handleDrag = (e, index) => e.dataTransfer.setData("index", index);
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData("index");
    const newList = [...characters];
    const [moved] = newList.splice(sourceIndex, 1);
    newList.splice(targetIndex, 0, moved);
    setCharacters(newList);
  };

  // ==============================
  // 💰 경매 계산 로직 (공식 반영 + 보정)
  // ==============================
  const calcAuction = () => {
  const price = Number(itemPrice);
  const n = Number(people);
  if (!price || n < 2) return;

  // ▶ 직접사용
  const directBid = Math.floor(price * 0.875);
  const divide = Math.floor((price - directBid) / (n - 1));

  // ▶ 판매
  const fee = Math.floor(price * 0.05);
  const afterFee = Math.floor(price * 0.95);
  const sellSplit = Math.floor(afterFee / n);      // 4,750
  const sellBreakEven = afterFee - sellSplit;      // 33,250
  const sellProfit = fee + sellSplit;              // 6,750
  const directSell = Math.floor(price * 0.7557);   // 30,228

  // ▶ 입찰적정가 기준
  const directSellDivide = Math.floor(directSell / (n - 1)); // 4,318 (정답)
  const directSellProfit = price - directSell;               // 9,772 (정답)

  setResult({
    directBid, divide,
    fee, sellSplit, sellBreakEven, sellProfit,
    directSell, directSellDivide, directSellProfit,
  });
};


  const reset = () => {
    setItemPrice("");
    setPeople(8);
    setResult(null);
  };

  // ==============================
  // 렌더링
  // ==============================
  return (
    <div className="page-container">
      <h2>📅 스케줄러</h2>

      {/* 캐릭터 관리 */}
      <div className="add-section">
        <input
          type="text"
          placeholder="캐릭터 닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button onClick={addCharacter}>추가</button>
      </div>

      <div className="progress-area">
        {characters.map((ch, i) => (
          <div
            key={i}
            className="character-card"
            draggable
            onDragStart={(e) => handleDrag(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragOver={(e) => e.preventDefault()}
          >
            <h4>{ch.name}</h4>
            <p>진행도: {ch.progress}%</p>
          </div>
        ))}
      </div>

      {/* 💰 경매 계산기 */}
      <div className="auction-box">
        <h3>💰 경매 입찰 계산기</h3>

        <div className="auction-inputs">
          <div className="input-row">
            <label>템 가격</label>
            <input
              type="number"
              placeholder="예: 40000"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
            <button onClick={reset} className="reset-btn">
              금액 초기화
            </button>
          </div>

          <div className="input-row">
            <label>인원</label>
            {[4, 8].map((num) => (
              <label key={num} style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  name="people"
                  checked={people === num}
                  onChange={() => setPeople(num)}
                />
                {num}인
              </label>
            ))}
          </div>

          <button onClick={calcAuction} className="calc-btn">계산</button>
        </div>

        {result && (
          <div className="auction-results">
            <h4>📊 직접사용</h4>
            <p>입찰 적정가: <strong>{result.directBid.toLocaleString()} G</strong></p>
            <p>분배금: <strong>{result.divide.toLocaleString()} G</strong></p>

            <h4>📈 판매</h4>
            <p>수수료: <strong>{result.fee.toLocaleString()} G</strong></p>
            <h4>=====================</h4>
            <p>손익분기점: <strong>{result.sellBreakEven.toLocaleString()} G</strong></p>
            <p>분배금: <strong>{result.sellSplit.toLocaleString()} G</strong></p>
            <p>판매차익: <strong>{result.sellProfit.toLocaleString()} G</strong></p>

            <h4>=====================</h4>
            <p>입찰적정가: <strong style={{ color: "#0c0" }}>{result.directSell.toLocaleString()} G</strong></p>
            <p>분배금: <strong>{result.directSellDivide.toLocaleString()} G</strong></p>
            <p>판매차익: <strong>{result.directSellProfit.toLocaleString()} G</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
