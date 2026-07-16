"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner, ErrorState } from "./ui";
import Sidebar from "./Sidebar";
import DashboardTab from "./tabs/DashboardTab";
import IncomeTab from "./tabs/IncomeTab";
import ExpenseTab from "./tabs/ExpenseTab";
import VerificationTab from "./tabs/VerificationTab";
import ReceiptsTab from "./tabs/ReceiptsTab";
import RolloverTab from "./tabs/RolloverTab";
import SettingsTab from "./tabs/SettingsTab";
import HelpTab from "./tabs/HelpTab";

type TabId =
  | "dashboard"
  | "verification"
  | "income"
  | "expense"
  | "receipts"
  | "rollover"
  | "settings"
  | "help";

const TITLES: Record<TabId, string> = {
  dashboard:    "แดชบอร์ดสรุปยอดสะสม",
  verification: "แนบใบเสร็จ / ตรวจสอบก่อนบันทึก",
  income:       "บันทึกรายรับประจำสัปดาห์",
  expense:      "บันทึกรายจ่ายและการเบิกเงิน",
  receipts:     "ออกใบอนุโมทนา / ใบรับบริจาค",
  rollover:     "ปิดยอดและกระทบบัญชีรอบสัปดาห์",
  settings:     "ตั้งค่าระบบ",
  help:         "คู่มือการใช้งาน",
};

export default function ChurchApp() {
  const { state, refresh } = useApp();
  const { logout } = useAuth();
  const [active, setActive] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (state.loading) return <LoadingSpinner />;
  if (state.error) return <ErrorState message={state.error} onRetry={refresh} />;

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={active}
        onTabChange={setActive}
        weekIndex={state.weekIndex}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="topbar-icon-btn topbar-hamburger"
              onClick={() => setSidebarOpen((p) => !p)}
              aria-label="เปิด/ปิดเมนู"
              aria-expanded={sidebarOpen}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <h1 className="topbar-title">{TITLES[active]}</h1>
          </div>

          <div className="topbar-right">
            {/* Week badge */}
            <div className="topbar-week">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              สัปดาห์ที่ {state.weekIndex}
            </div>

            {/* Logout */}
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={logout}
              title="ออกจากระบบ"
              aria-label="ออกจากระบบ"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <div className="page-inner fade-in" key={active}>
            {active === "dashboard"    && <DashboardTab />}
            {active === "income"       && <IncomeTab />}
            {active === "expense"      && <ExpenseTab />}
            {active === "verification" && <VerificationTab />}
            {active === "receipts"     && <ReceiptsTab />}
            {active === "rollover"     && <RolloverTab />}
            {active === "settings"     && <SettingsTab />}
            {active === "help"         && <HelpTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
