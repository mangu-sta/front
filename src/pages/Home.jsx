import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/index.css";

export default function Home() {
  const [islands, setIslands] = useState([]);
  const [nowEpochMs, setNowEpochMs] = useState(0);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate(); 

  const driftRef = useRef(0);
  useEffect(() => {
    if (nowEpochMs) {
      driftRef.current = Date.now() - nowEpochMs;
    }
  }, [nowEpochMs]);

  useEffect(() => {
    fetch("/api/islands/today")
      .then((res) => res.json())
      .then((data) => {
        setIslands(data.adventureIslands || []);
        setNowEpochMs(data.nowEpochMs || 0);
      })
      .catch((err) => console.error("❌ 섬 데이터 불러오기 실패:", err));
  }, []);

  // ====== 유틸 ======
  const toDate = (raw) => {
    const [date, time] = raw.split("T");
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm, ss] = time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, ss);
  };

  // ====== 모험의 섬 타이머 ======
  const [remaining, setRemaining] = useState("00:00:00");

  useEffect(() => {
    if (!islands.length || !islands[index]) return;

    const tick = () => {
      const island = islands[index]; // 최신 참조
      const now = new Date(Date.now() - driftRef.current);

      let next = null;
      for (const t of island.startTimes || []) {
        const d = toDate(t);
        if (d > now) {
          next = d;
          break;
        }
      }

      if (!next) {
        setRemaining("오늘 일정 종료");
        return;
      }

      const diff = Math.floor((next - now) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setRemaining(`${h}:${m}:${s}`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [islands, index]);

  // ====== 필드보스 / 카게 ======
  const [bossTime, setBossTime] = useState({ next: "--:--", remain: "00:00:00" });
  const [gateTime, setGateTime] = useState({ next: "--:--", remain: "00:00:00" });

  useEffect(() => {
    const fieldDays = [0, 2, 5];
    const gateDays  = [0, 1, 4, 6];

    const getNextEvent = (minuteMark, activeDays) => {
      const now = new Date();
      const d = now.getDay();
      const next = new Date(now);
      next.setSeconds(0); next.setMilliseconds(0); next.setMinutes(minuteMark);
      if (now.getMinutes() >= minuteMark) next.setHours(next.getHours() + 1);

      let addDays = 0;
      while (!activeDays.includes((d + addDays) % 7)) addDays++;
      next.setDate(now.getDate() + addDays);
      if (addDays === 0 && now > next) {
        do { next.setDate(next.getDate() + 1); } while (!activeDays.includes(next.getDay()));
      }
      return next;
    };

    const formatDiff = (target) => {
      const now = new Date();
      const diff = Math.floor((target - now) / 1000);
      if (diff <= 0) return "00:00:00";
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    const formatClock = (date) => {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    const updateTimers = () => {
      const today = new Date().getDay();

      if (!fieldDays.includes(today)) {
        setBossTime({ next: "-", remain: "오늘은 등장 없음" });
      } else {
        const nextBoss = getNextEvent(3, fieldDays);
        setBossTime({ next: formatClock(nextBoss), remain: formatDiff(nextBoss) });
      }

      if (!gateDays.includes(today)) {
        setGateTime({ next: "-", remain: "오늘은 등장 없음" });
      } else {
        const nextGate = getNextEvent(0, gateDays);
        setGateTime({ next: formatClock(nextGate), remain: formatDiff(nextGate) });
      }
    };

    updateTimers();
    const id = setInterval(updateTimers, 1000);
    return () => clearInterval(id);
  }, []);

  // ====== 🖼️ 렌더링 ======
  return (
    <div className="main-content">
      {/* 🔸 메인 블록 */}
      <section>
        <div
          className="block scheduler"
          onClick={() => {
            navigate("/scheduler");
            window.location.href = "/scheduler";
          }}
        >
          <h2>스케줄러</h2>
        </div>

        <div className="sub-grid">
          <div
            className="block"
            onClick={() => {
              navigate("/community");
              window.location.href = "/community";
            }}
          >
            <h2>커뮤니티</h2>
          </div>
          <div
            className="block"
            onClick={() => {
              navigate("/character/search");
              window.location.href = "/character/search";
            }}
          >
            <h2>캐릭터 검색</h2>
          </div>
          <div
            className="block"
            onClick={() => {
              navigate("/raid/info");
              window.location.href = "/raid/info";
            }}
          >
            <h2>콘텐츠 정보</h2>
          </div>
          <div
            className="block"
            onClick={() => {
              navigate("/AccidentSearch");
              window.location.href = "/AccidentSearch";
            }}
          >
            <h2>사사게 검색</h2>
          </div>
        </div>
      </section>

      {/* 🔸 타이머 영역 */}
      <section className="timer-section">
        <h3>게임 내 콘텐츠 타이머</h3>

        <div className="timer-grid">
          {/* 모험의 섬 */}
          <div className="timer-card">
            <h4>모험의 섬</h4>
            {!islands.length ? (
              <div>오늘 등장 예정인 모험의 섬이 없습니다.</div>
            ) : (
              <>
                <div className="card p-3 text-center">
                  <h5>{islands[index]?.name}</h5>
                  <p className="text-muted">위치: {islands[index]?.location}</p>
                  <div>
                    <span className="fw-semibold">다음 등장:</span>{" "}
                    {islands[index]?.nextTime?.substring(11, 16)}
                  </div>
                  <div className="timer my-3">{remaining}</div>
                  <div className="d-flex flex-wrap justify-content-center gap-1">
                    {islands[index]?.startTimes?.map((t) => (
                      <span key={t} className="badge text-bg-light border badge-time">
                        {t.substring(11, 16)}
                      </span>
                    ))}
                  </div>
                  <ul className="reward-list mt-3">
                    {islands[index]?.rewards?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* 섬 변경 버튼 */}
                <div>
                  <span
                    className="nav-arrow"
                    onClick={() => setIndex((index - 1 + islands.length) % islands.length)}
                  >
                    ⟨
                  </span>
                  <span
                    className="nav-arrow"
                    onClick={() => setIndex((index + 1) % islands.length)}
                  >
                    ⟩
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 필드보스 */}
          <div className="timer-card">
            <h4>필드보스</h4>
            <div>
              <span className="fw-semibold">다음 등장:</span> {bossTime.next}
            </div>
            <div className="timer my-2">{bossTime.remain}</div>
          </div>

          {/* 카오스게이트 */}
          <div className="timer-card">
            <h4>카오스<br />게이트</h4>
            <div>
              <span className="fw-semibold">다음 등장:</span> {gateTime.next}
            </div>
            <div className="timer my-2">{gateTime.remain}</div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
