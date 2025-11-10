import React from "react";
import "../styles/login-popup.css";

function LoginPopup({ onClose, onSignup }) {
  return (
    <div className="login-popup-container" onClick={onClose}>
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기(X) 버튼 */}
        <button className="close-btn-x" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <h2>로그인</h2>
        <form>
          <label>이메일</label>
          <input type="email" placeholder="이메일 입력" required />

          <label>비밀번호</label>
          <input type="password" placeholder="비밀번호 입력" required />

          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        {/* ✅ 하단 구글 로그인 및 회원가입 */}
        <div className="popup-actions">
          <button
              className="google-btn"
              onClick={() => {
                window.location.href = "http://localhost:8080/oauth2/authorization/google";
              }}
            >
              <img src="/src/assets/google-icon.png" alt="Google" className="google-icon" />
              Google 로그인
            </button>
          <button className="signup-btn" onClick={onSignup}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPopup;
