import React, { useState } from "react";
import "../styles/signup-popup.css";

function SignupPopup({ onClose, onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/user/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
      }),
    });

    if (res.ok) {
      alert("🎉 회원가입이 완료되었습니다!");
      onClose(); // 팝업 닫기
    } else {
      const errMsg = await res.text();
      alert("회원가입 실패: " + errMsg);
    }
  } catch (err) {
    console.error("회원가입 요청 실패:", err);
    alert("서버 오류가 발생했습니다.");
  }
};



  return (
    <div className="signup-popup-container" onClick={onClose}>
      <div className="signup-popup" onClick={(e) => e.stopPropagation()}>
        {/* 닫기(X) 버튼 */}
        <button className="close-btn-x" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일 입력"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임 입력"
            value={formData.nickname}
            onChange={handleChange}
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn-main">
            회원가입
          </button>
        </form>

        <div className="popup-actions">
          <button className="login-switch-btn" onClick={onLogin}>
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPopup;
