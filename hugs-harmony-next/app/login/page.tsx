"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await login(username, password);
      if (ok) {
        router.push("/");
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* ── Left panel (desktop only) ── */}
      <aside className="login-panel">
        <div className="login-panel-logo">
          <div className="login-panel-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="4" y1="9" x2="20" y2="9" />
            </svg>
          </div>
          <div>
            <div className="login-panel-name">ชีวิตสุขสันต์กาฬสินธุ์</div>
            <div className="login-panel-sub">ระบบบัญชีคริสตจักร</div>
          </div>
        </div>

        <blockquote className="login-panel-quote">
          <p>
            &ldquo;จงวางใจในพระเจ้าด้วยสุดใจของเจ้า
            และอย่าพึ่งพาความเข้าใจของตัวเอง&rdquo;
          </p>
          <cite>สุภาษิต 3:5</cite>
        </blockquote>
      </aside>

      {/* ── Right panel — form ── */}
      <main className="login-form-area">
        <div className="login-card">
          <header className="login-card-header">
            {/* Mobile-only logo */}
            <div className="login-mobile-logo" aria-hidden="true">
              <div className="login-mobile-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="4" y1="9" x2="20" y2="9" />
                </svg>
              </div>
              <div className="login-panel-name" style={{ color: "var(--c-text)" }}>ชีวิตสุขสันต์กาฬสินธุ์</div>
            </div>
            <h1 className="login-title">เข้าสู่ระบบ</h1>
            <p className="login-subtitle">กรุณากรอกชื่อผู้ใช้และรหัสผ่านเพื่อดำเนินการต่อ</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-username">
                ชื่อผู้ใช้
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="login-username"
                  type="text"
                  className="login-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ชื่อผู้ใช้"
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                รหัสผ่าน
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-input-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="login-meta">
              <label className="login-remember">
                <div
                  className={`login-checkbox${rememberMe ? " checked" : ""}`}
                  aria-hidden="true"
                >
                  {rememberMe && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                />
                จดจำฉัน
              </label>
              <button type="button" className="login-forgot">
                ลืมรหัสผ่าน?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className="login-btn"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <>
                  <span className="login-spinner" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  </span>
                  กำลังตรวจสอบ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
