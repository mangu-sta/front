import { useState, useEffect } from "react";
import "../styles/common.css";
import LoginPopup from "./LoginPopup"; // 로그인 팝업 컴포넌트 추가
import SignupPopup from "./SignupPopup";


export default function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // 팝업 표시 여부
  const [showSignup, setShowSignup] = useState(false);


  useEffect(() => {
    fetch("http://localhost:8080/api/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
          setIsAdmin(data.user.role === "ADMIN");
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1080) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // // ✅ 회원가입 버튼 눌렀을 때
  // const handleSignup = () => {
  //   alert("회원가입 페이지로 이동하거나 팝업 전환");
  // };



  return (
    <>

    {/* 🧩 로그인 팝업 */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
        />
      )}

    {showSignup && (
      <SignupPopup
        onClose={() => setShowSignup(false)}
        onLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    )}

      {/* 🌙 오버레이 */}
      <div className={`menu-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)}></div>

      <header className="main-header">
        {/* 🍔 햄버거 버튼 */}
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="메뉴 열기/닫기">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="6" width="18" height="2" />
            <rect x="3" y="11" width="18" height="2" />
            <rect x="3" y="16" width="18" height="2" />
          </svg>
        </button>

        {/* 🪶 로고 */}
        <div className="logo" onClick={() => (window.location.href = "/")}>
          <img src="/src/assets/logo.png" alt="사이트 로고" className="logo-img" />
        </div>

        {/* 📋 메뉴 (헤더 안에 위치해야 PC에서 보임) */}
        <nav className={`menu ${menuOpen ? "open" : ""}`} id="mainMenu">
         
          <button className="sidebar-close-btn" onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기">
            ✕
          </button>

          <button
            id="themeToggleSidebar"
            className="sidebar-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="emoji">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>

          <a href="/scheduler">
            <span className="icon">🕒</span> 스케줄러
          </a>
          <a href="/community">
            <span className="icon">💬</span> 커뮤니티
          </a>
          <a href="/character/search">
            <span className="icon">🧙‍♂️</span> 캐릭터 검색
          </a>
          <a href="/raid/info">
            <span className="icon">⚔️</span> 레이드 정보
          </a>
          <a href="/AccidentSearch">
            <span className="icon">📰</span> 사사게 검색
          </a>

          {/* 사이드바 하단부 */}
          <div className="sidebar-footer">
            <form className="search-box" action="/search" method="get">
              <input type="text" name="q" placeholder="캐릭터 검색..." />
              <button type="submit" aria-label="검색">🔍</button>
            </form>

            <div className="sidebar-login">
              {!isLoggedIn ? (
                <button id="react-login-btn" type="button" onClick={() => setShowLogin(true)}>
                  로그인
                </button>
              ) : (
                <>
                  <button onClick={() => (window.location.href = "/member/logout")}>로그아웃</button>
                  {isAdmin && <button onClick={() => (window.location.href = "/admin")}>관리자</button>}
                </>
              )}
            </div>
          </div>
        </nav>

        {/* 🌙 사용자 메뉴 (PC 우측) */}
        <div className="user-menu">
          <form className="search-box" action="/search" method="get">
            <input type="text" name="q" placeholder="캐릭터 검색..." />
            <button type="submit" aria-label="검색">🔍</button>
          </form>

          <div className="user-actions">
            <button
              id="themeToggle"
              className="theme-toggle"
              aria-label="테마 변경"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {!isLoggedIn ? (
              <button id="react-login-btn-top" type="button" onClick={() => setShowLogin(true)}>
                로그인
              </button>
            ) : (
              <>
                <button onClick={() => (window.location.href = "/member/logout")}>로그아웃</button>
                {isAdmin && <button onClick={() => (window.location.href = "/admin")}>관리자</button>}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
