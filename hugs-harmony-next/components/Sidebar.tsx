"use client";

import { useAuth } from "@/contexts/AuthContext";

type TabId =
  | "dashboard"
  | "verification"
  | "income"
  | "expense"
  | "receipts"
  | "rollover"
  | "settings"
  | "help";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  weekIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const MAIN_TABS: { id: TabId; label: string; d: string }[] = [
  {
    id: "dashboard",
    label: "แดชบอร์ด",
    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    id: "income",
    label: "บันทึกรายรับ",
    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    id: "expense",
    label: "บันทึกใบเบิกจ่าย",
    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    id: "verification",
    label: "แนบใบเสร็จ / ตรวจสอบ",
    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    id: "receipts",
    label: "ใบอนุโมทนา",
    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    id: "rollover",
    label: "ปิดยอดวันอาทิตย์",
    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
];

const TOOL_TABS: { id: TabId; label: string; d: string }[] = [
  {
    id: "settings",
    label: "ตั้งค่าระบบ",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    id: "help",
    label: "คู่มือ / ช่วยเหลือ",
    d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

function NavItem({
  id, label, d, isActive, onClick,
}: {
  id: string; label: string; d: string; isActive: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`sidebar-nav-item${isActive ? " active" : ""}`}
    >
      <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
      </svg>
      {label}
    </button>
  );
}

export default function Sidebar({ activeTab, onTabChange, weekIndex, isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const handleClick = (id: TabId) => {
    onTabChange(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: "fixed", inset: 0, zIndex: 39,
            background: "rgba(0,0,0,0.45)",
          }}
        />
      )}

      <nav
        className={`sidebar${isOpen ? " open" : ""}`}
        aria-label="การนำทางหลัก"
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="4" y1="9" x2="20" y2="9" />
            </svg>
          </div>
          <div>
            <div className="sidebar-brand-name">ชีวิตสุขสันต์กาฬสินธุ์</div>
            <div className="sidebar-brand-sub">ระบบบัญชีคริสตจักร</div>
          </div>
        </div>

        {/* Week */}
        <div className="sidebar-week">
          <span className="sidebar-week-label">รอบบัญชี</span>
          <span className="sidebar-week-badge">สัปดาห์ที่ {weekIndex}</span>
        </div>

        {/* Nav */}
        <div className="sidebar-nav">
          <div className="sidebar-section-label">หลัก</div>
          {MAIN_TABS.map((t) => (
            <NavItem key={t.id} {...t} isActive={activeTab === t.id} onClick={() => handleClick(t.id)} />
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-section-label">เครื่องมือ</div>
          {TOOL_TABS.map((t) => (
            <NavItem key={t.id} {...t} isActive={activeTab === t.id} onClick={() => handleClick(t.id)} />
          ))}
        </div>

        {/* Logout */}
        <div className="sidebar-footer">
          <button type="button" onClick={logout} className="sidebar-logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            ออกจากระบบ
          </button>
        </div>
      </nav>
    </>
  );
}
