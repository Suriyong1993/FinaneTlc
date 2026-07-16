"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { formatMoney } from "@/lib/api";
import {
  FUND_KEYS,
  FUND_LABELS,
  exportHistoryCSV,
} from "@/components/helpers";
import type { FundKey } from "@/types";

// ── Stat card ──────────────────────────────────────────
function StatCard({
  label,
  value,
  variant,
  icon,
}: {
  label: string;
  value: string;
  variant: "green" | "amber" | "purple";
  icon: React.ReactNode;
}) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-label">{label}</p>
        <p className={`stat-value ${variant}`}>{value}</p>
      </div>
      <div className={`stat-icon ${variant}`}>{icon}</div>
    </div>
  );
}

// ── Fund row ───────────────────────────────────────────
function FundRow({
  label,
  value,
  pct,
  barColor,
  barPct,
}: {
  label: string;
  value: string;
  pct: string;
  barColor: string;
  barPct: number;
}) {
  return (
    <div className="fund-row">
      <div className="fund-row-header">
        <div className="fund-row-left">
          <span className="fund-dot" style={{ backgroundColor: barColor }} />
          <span className="fund-name">{label}</span>
        </div>
        <div className="fund-row-right">
          <span className="fund-pct">{pct}%</span>
          <span className="fund-amount">฿{value}</span>
        </div>
      </div>
      <div className="fund-bar-track">
        <div
          className="fund-bar-fill"
          style={{ width: `${barPct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

// Custom colors for specific funds
const FUND_BAR_COLORS: Record<FundKey, string> = {
  tithe: "#10b981",    // emerald
  rent: "#0ea5e9",     // sky
  memorial: "#a855f7", // purple
  mission: "#6366f1",  // indigo
  special: "#f59e0b",  // amber
  land: "#f43f5e",     // rose
  party: "#78716c",    // stone
};

// ── Main component ─────────────────────────────────────
export default function DashboardTab() {
  const { state, saveSettings } = useApp();
  const { cash, bank, donationRows, history } = state;
  const [weeklyNote, setWeeklyNote] = useState(
    state.settings?.weekly_note ?? ""
  );
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const handleNoteChange = useCallback(
    (value: string) => {
      setWeeklyNote(value);
      clearTimeout(noteTimerRef.current);
      noteTimerRef.current = setTimeout(
        () => saveSettings({ weekly_note: value }),
        600
      );
    },
    [saveSettings]
  );

  useEffect(() => () => clearTimeout(noteTimerRef.current), []);

  const total = cash + bank;

  // Fund breakdown
  const currentFunds = {} as Record<FundKey, number>;
  FUND_KEYS.forEach((k) => (currentFunds[k] = 0));
  donationRows.forEach((r) =>
    FUND_KEYS.forEach((k) => (currentFunds[k] += r[k] || 0))
  );

  const allTimeFunds = { ...currentFunds };
  history.forEach((h) =>
    FUND_KEYS.forEach((k) => (allTimeFunds[k] += h[k] || 0))
  );
  const grandTotal = FUND_KEYS.reduce((s, k) => s + allTimeFunds[k], 0);
  const fundMax = Math.max(...FUND_KEYS.map((k) => allTimeFunds[k]), 1);

  const weeklyIncome = donationRows.reduce(
    (s, r) => s + FUND_KEYS.reduce((fs, k) => fs + (r[k] || 0), 0),
    0
  );

  return (
    <div className="tab-stack">
      {/* ── Hero: total balance ── */}
      <section aria-label="ยอดรวมทั้งสิ้น">
        <p className="dash-section-title">สรุปยอดสะสม</p>
        <div className="balance-card">
          <p className="balance-total-label">ยอดรวมทั้งสิ้น</p>
          <p className="balance-total-amount">฿{formatMoney(total)}</p>
          <div className="balance-accent-line" />

          <div className="balance-breakdown">
            <div className="balance-item">
              <p className="balance-item-label">เงินสด</p>
              <p className="balance-item-amount green">฿{formatMoney(cash)}</p>
            </div>
            <div className="balance-item">
              <p className="balance-item-label">ธนาคาร</p>
              <p className="balance-item-amount blue">฿{formatMoney(bank)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick stats row ── */}
      <section aria-label="สถิติ">
        <p className="dash-section-title">สถิติสัปดาห์นี้</p>
        <div className="stat-row">
          <StatCard
            label="รายรับ (สัปดาห์นี้)"
            value={`฿${formatMoney(weeklyIncome)}`}
            variant="green"
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            }
          />
          <StatCard
            label="จำนวนผู้ถวาย"
            value={`${donationRows.filter((r) => FUND_KEYS.some((k) => r[k] > 0)).length} คน`}
            variant="amber"
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
          />
          <StatCard
            label="รอบบัญชีที่ผ่านมา"
            value={`${history.length} รอบ`}
            variant="purple"
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── Fund breakdown + Note ── */}
      <div className="dash-two-col">
        {/* Fund table */}
        <section aria-label="สรุปกองทุน">
          <p className="dash-section-title">สรุปกองทุน (สะสม)</p>
          <div className="fund-table">
            {FUND_KEYS.map((key) => {
              const val = allTimeFunds[key];
              const pct = grandTotal > 0 ? (val / grandTotal) * 100 : 0;
              const barPct = fundMax > 0 ? (val / fundMax) * 100 : 0;
              return (
                <FundRow
                  key={key}
                  label={FUND_LABELS[key]}
                  value={formatMoney(val)}
                  pct={pct.toFixed(1)}
                  barColor={FUND_BAR_COLORS[key]}
                  barPct={barPct}
                />
              );
            })}
            {/* Total footer */}
            <div className="fund-total">
              <span className="fund-total-label">รวมกองทุนทั้งสิ้น</span>
              <span className="fund-total-amount">฿{formatMoney(grandTotal)}</span>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section aria-label="บันทึกประจำสัปดาห์">
          <p className="dash-section-title">บันทึกประจำสัปดาห์</p>
          <div className="note-card">
            <p className="note-hint">
              บันทึกเหตุการณ์พิเศษหรือหมายเหตุที่จะถูกบันทึกตอนปิดยอดบัญชีประจำรอบสัปดาห์
            </p>
            <textarea
              value={weeklyNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              rows={6}
              placeholder="เช่น มีการรับสมาชิกใหม่, บันทึกพิเศษประจำสัปดาห์..."
              className="note-textarea"
            />
            <p className="note-autosave">✓ บันทึกอัตโนมัติเมื่อหยุดพิมพ์</p>
          </div>
        </section>
      </div>

      {/* ── History ── */}
      <section aria-label="ประวัติรายสัปดาห์">
        <div className="section-header">
          <p className="dash-section-title" style={{ margin: 0 }}>ประวัติบัญชีรายสัปดาห์</p>
          {history.length > 0 && (
            <button type="button" onClick={() => exportHistoryCSV(history)} className="export-btn">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              ส่งออก CSV
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="empty-title">ยังไม่มีประวัติบัญชี</p>
            <p className="empty-desc">
              เมื่อทำการปิดยอดสัปดาห์ที่ส่วนงาน &ldquo;ปิดยอดวันอาทิตย์&rdquo; ข้อมูลประวัติรายสัปดาห์จะปรากฏขึ้นที่นี่
            </p>
          </div>
        ) : (
          <div className="history-table">
            {/* Table header */}
            <div className="history-thead">
              <span className="history-th">สัปดาห์</span>
              <span className="history-th">วันที่ปิดยอด</span>
              <span className="history-th">ยอดเปิดรวม</span>
              <span className="history-th">รายรับสะสม</span>
              <span className="history-th">รายจ่ายสะสม</span>
              <span className="history-th" style={{ textAlign: "right" }}>ยอดปิดรวม</span>
            </div>
            {history.map((log) => (
              <div key={log.week} className="history-row">
                <span className="history-week">สัปดาห์ที่ {log.week}</span>
                <span className="history-date">{log.date_closed}</span>
                <span className="history-amount">
                  ฿{formatMoney(log.open_cash + log.open_online)}
                </span>
                <span className="history-amount income">
                  +฿{formatMoney(log.income_cash + log.income_online)}
                </span>
                <span className="history-amount expense">
                  -฿{formatMoney(log.expenses)}
                </span>
                <span className="history-amount total">
                  ฿{formatMoney(log.close_cash + log.close_online)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
