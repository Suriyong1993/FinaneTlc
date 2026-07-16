"use client";

import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const starData = [
    { top: "10%", left: "15%", size: 1.5, dur: "4s", delay: "0s",   op: "0.4" },
    { top: "20%", left: "75%", size: 2,   dur: "3s", delay: "1s",   op: "0.5" },
    { top: "35%", left: "5%",  size: 1,   dur: "5s", delay: "0.5s", op: "0.3" },
    { top: "55%", left: "90%", size: 1.5, dur: "6s", delay: "2s",   op: "0.4" },
    { top: "70%", left: "20%", size: 1,   dur: "4s", delay: "1.5s", op: "0.3" },
    { top: "80%", left: "60%", size: 2,   dur: "5s", delay: "0.8s", op: "0.45"},
    { top: "90%", left: "35%", size: 1,   dur: "7s", delay: "2.5s", op: "0.3" },
    { top: "5%",  left: "50%", size: 1.5, dur: "3.5s",delay:"1.2s", op: "0.35"},
  ];

  return (
    <div className="lp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .lp-root {
          min-height: 100vh;
          background: radial-gradient(ellipse at 60% 0%, #1e1b4b 0%, #0f172a 45%, #080812 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter','Sarabun',sans-serif;
        }
        .lp-orb1 {
          position: absolute; top: -20%; left: -10%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
          animation: lpOrb 8s ease-in-out infinite alternate;
        }
        .lp-orb2 {
          position: absolute; bottom: -20%; right: -10%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
          animation: lpOrb 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes lpOrb {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px,20px) scale(1.05); }
        }
        .lp-star {
          position: absolute; border-radius: 50%; background: #fff;
          animation: lpTwinkle var(--d,3s) ease-in-out infinite alternate;
          opacity: 0;
        }
        @keyframes lpTwinkle {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: var(--o,0.5); transform: scale(1.2); }
        }
        .lp-wrapper {
          position: relative; z-index: 10;
          width: 100%; max-width: 400px;
          opacity: 0; transform: translateY(24px);
          transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
        }
        .lp-wrapper.up { opacity: 1; transform: translateY(0); }
        .lp-logo-ring { display: flex; justify-content: center; margin-bottom: -28px; position: relative; z-index: 2; }
        .lp-logo {
          width: 80px; height: 80px; border-radius: 24px;
          background: linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 4px rgba(99,102,241,.25),0 0 0 8px rgba(99,102,241,.1),0 20px 40px rgba(99,102,241,.4);
          animation: lpPulse 4s ease-in-out infinite;
        }
        @keyframes lpPulse {
          0%,100%{ box-shadow:0 0 0 4px rgba(99,102,241,.25),0 0 0 8px rgba(99,102,241,.1),0 20px 40px rgba(99,102,241,.4); }
          50%    { box-shadow:0 0 0 6px rgba(99,102,241,.35),0 0 0 12px rgba(99,102,241,.15),0 24px 48px rgba(99,102,241,.5); }
        }
        .lp-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 24px;
          padding: 48px 36px 36px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 0 0 1px rgba(255,255,255,.06) inset, 0 32px 64px rgba(0,0,0,.5), 0 8px 32px rgba(99,102,241,.1);
        }
        .lp-title {
          font-size: 1.75rem; font-weight: 800; text-align: center;
          background: linear-gradient(135deg,#a5b4fc,#c4b5fd,#e9d5ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: -.03em; margin-bottom: 6px;
        }
        .lp-sub {
          text-align: center; color: rgba(255,255,255,.45);
          font-size: .85rem; margin-bottom: 32px; font-family:'Sarabun',sans-serif;
        }
        .lp-label {
          display: block; font-size: .75rem; font-weight: 500;
          color: rgba(255,255,255,.5); letter-spacing: .06em; text-transform: uppercase;
          margin-bottom: 8px; font-family:'Sarabun',sans-serif;
        }
        .lp-input-wrap { position: relative; margin-bottom: 16px; }
        .lp-iico {
          position: absolute; top: 50%; left: 14px; transform: translateY(-50%);
          color: rgba(255,255,255,.3); pointer-events: none; display: flex;
        }
        .lp-input {
          width: 100%; background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1); border-radius: 12px;
          padding: 14px 44px; color: #fff; font-size: .9rem;
          font-family:'Inter','Sarabun',sans-serif; outline: none; box-sizing: border-box;
          transition: border-color .2s,background .2s,box-shadow .2s;
        }
        .lp-input::placeholder { color: rgba(255,255,255,.2); }
        .lp-input:focus {
          border-color: rgba(139,92,246,.6); background: rgba(139,92,246,.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,.12),inset 0 0 0 1px rgba(139,92,246,.1);
        }
        .lp-eye {
          position: absolute; top: 50%; right: 14px; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,.3); display: flex; padding: 4px; border-radius: 6px;
          transition: color .15s;
        }
        .lp-eye:hover { color: rgba(255,255,255,.6); }
        .lp-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin: 4px 0 24px;
        }
        .lp-remember {
          display: flex; align-items: center; gap: 8px; cursor: pointer;
          font-size: .82rem; color: rgba(255,255,255,.45); font-family:'Sarabun',sans-serif; user-select: none;
        }
        .lp-check {
          width: 16px; height: 16px; border: 1px solid rgba(255,255,255,.2);
          border-radius: 4px; background: rgba(255,255,255,.04);
          display: flex; align-items: center; justify-content: center;
          transition: all .15s; flex-shrink: 0;
        }
        .lp-check.on { background: #6366f1; border-color: #6366f1; }
        .lp-forgot {
          background: none; border: none; cursor: pointer; font-size: .82rem;
          color: #a78bfa; font-family:'Sarabun',sans-serif; padding: 0; transition: color .15s;
        }
        .lp-forgot:hover { color: #c4b5fd; text-decoration: underline; }
        .lp-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.3);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
          color: #fca5a5; font-size: .82rem; font-family:'Sarabun',sans-serif;
          animation: lpShake .4s ease;
        }
        @keyframes lpShake {
          0%,100%{ transform:translateX(0); }
          20%{ transform:translateX(-6px); }
          40%{ transform:translateX(6px); }
          60%{ transform:translateX(-4px); }
          80%{ transform:translateX(4px); }
        }
        .lp-btn {
          width: 100%; position: relative;
          background: linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea);
          border: none; border-radius: 14px; padding: 15px 24px;
          color: #fff; font-size: .95rem; font-weight: 600;
          font-family:'Sarabun',sans-serif; cursor: pointer; overflow: hidden;
          transition: all .25s ease;
          box-shadow: 0 4px 24px rgba(99,102,241,.45),0 0 0 1px rgba(255,255,255,.08) inset;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .lp-btn::before {
          content:''; position:absolute; top:0;left:0;right:0; height:1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
        }
        .lp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,.55),0 0 0 1px rgba(255,255,255,.12) inset;
        }
        .lp-btn:active:not(:disabled) { transform:translateY(0); box-shadow:0 2px 12px rgba(99,102,241,.4); }
        .lp-btn:disabled { opacity:.5; cursor:not-allowed; }
        .lp-btn-icon {
          position:absolute; top:50%; right:16px; transform:translateY(-50%);
          width:36px; height:36px; background:rgba(255,255,255,.12); border-radius:10px;
          display:flex; align-items:center; justify-content:center; font-size:1.1rem;
        }
        .lp-btn-lbl { flex:1; text-align:center; }
        @keyframes lpSpin { to { transform:rotate(360deg); } }
        .lp-spin { animation:lpSpin .8s linear infinite; display:inline-block; vertical-align:middle; margin-right:6px; }
        @keyframes lpPulseText { 0%,100%{opacity:1}50%{opacity:.6} }
        .lp-loading { animation:lpPulseText 1s ease-in-out infinite; }
        .lp-divider { display:flex; align-items:center; gap:12px; margin:24px 0; }
        .lp-dline { flex:1; height:1px; background:rgba(255,255,255,.08); }
        .lp-dtext { font-size:.75rem; color:rgba(255,255,255,.3); white-space:nowrap; font-family:'Sarabun',sans-serif; }
        .lp-social { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:8px; }
        .lp-sbtn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09);
          border-radius:12px; padding:12px 16px; color:rgba(255,255,255,.7);
          font-size:.85rem; font-weight:500; font-family:'Sarabun',sans-serif;
          cursor:not-allowed; opacity:.6; transition:all .2s;
        }
        .lp-reg { text-align:center; margin-top:20px; font-size:.83rem; color:rgba(255,255,255,.35); font-family:'Sarabun',sans-serif; }
        .lp-reg-link { color:#a78bfa; font-weight:600; cursor:pointer; transition:color .15s; }
        .lp-reg-link:hover { color:#c4b5fd; text-decoration:underline; }
      `}</style>

      <div className="lp-orb1" aria-hidden="true" />
      <div className="lp-orb2" aria-hidden="true" />

      {starData.map((s, i) => (
        <div
          key={i}
          className="lp-star"
          aria-hidden="true"
          style={{
            top: s.top, left: s.left,
            width: s.size + "px", height: s.size + "px",
            "--d": s.dur, "--o": s.op,
            animationDelay: s.delay,
          } as React.CSSProperties}
        />
      ))}

      <div className={`lp-wrapper${mounted ? " up" : ""}`}>
        {/* Logo */}
        <div className="lp-logo-ring">
          <div className="lp-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="17" y="6" width="6" height="28" rx="3" fill="white" opacity="0.95"/>
              <rect x="8" y="15" width="24" height="6" rx="3" fill="white" opacity="0.95"/>
              <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="lp-card">
          <h1 className="lp-title">คริสตจักรชีวิตสุขสันต์</h1>
          <p className="lp-sub">ยินดีต้อนรับ — กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <label className="lp-label" htmlFor="lp-user">ชื่อผู้ใช้</label>
            <div className="lp-input-wrap">
              <span className="lp-iico">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="lp-user"
                type="text"
                className="lp-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ชื่อผู้ใช้ของคุณ"
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <label className="lp-label" htmlFor="lp-pass">รหัสผ่าน</label>
            <div className="lp-input-wrap">
              <span className="lp-iico">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="lp-pass"
                type={showPassword ? "text" : "password"}
                className="lp-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="lp-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="lp-meta">
              <label className="lp-remember" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`lp-check${rememberMe ? " on" : ""}`}>
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} style={{ display: "none" }} />
                จดจำฉัน
              </label>
              <button type="button" className="lp-forgot">ลืมรหัสผ่าน?</button>
            </div>

            {/* Error */}
            {error && (
              <div className="lp-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Sign in button */}
            <button
              id="login-submit-btn"
              type="submit"
              className="lp-btn"
              disabled={loading || !password}
            >
              {loading ? (
                <span className="lp-loading lp-btn-lbl">
                  <svg className="lp-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  กำลังตรวจสอบ...
                </span>
              ) : (
                <>
                  <span className="lp-btn-lbl">เข้าสู่ระบบ</span>
                  <span className="lp-btn-icon" aria-hidden="true">⛪</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="lp-divider">
            <div className="lp-dline"/>
            <span className="lp-dtext">หรือดำเนินการต่อด้วย</span>
            <div className="lp-dline"/>
          </div>

          {/* Social */}
          <div className="lp-social">
            <button id="login-google-btn" type="button" className="lp-sbtn" disabled title="เร็วๆ นี้">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button id="login-apple-btn" type="button" className="lp-sbtn" disabled title="เร็วๆ นี้">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Register */}
          <p className="lp-reg">
            ยังไม่มีบัญชี?{" "}
            <span className="lp-reg-link">สมัครสมาชิก</span>
          </p>
        </div>
      </div>
    </div>
  );
}
