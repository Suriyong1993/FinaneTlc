import type { HistoryRecord, FundKey } from "@/types";
import { FUND_LABELS } from "@/types";

export { FUND_LABELS };
export type { FundKey };

export const FUND_KEYS: FundKey[] = ["tithe", "rent", "memorial", "mission", "special", "land", "party"];

export const FUND_DOT_COLORS: Record<FundKey, string> = {
  tithe: "bg-emerald-500",
  rent: "bg-sky-500",
  memorial: "bg-purple-500",
  mission: "bg-indigo-500",
  special: "bg-amber-500",
  land: "bg-rose-500",
  party: "bg-stone-400",
};

export const FUND_BAR_COLORS: Record<FundKey, string> = {
  tithe: "#10b981",
  rent: "#0ea5e9",
  memorial: "#a855f7",
  mission: "#6366f1",
  special: "#f59e0b",
  land: "#f43f5e",
  party: "#a8a29e",
};

// ─── Form inputs ─────────────────────────────────────

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-ink-muted mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-rule rounded-sm py-2 px-3 text-sm outline-none bg-white text-ink ${className}`}
      />
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold text-ink tabular-nums">{value}</span>
    </div>
  );
}

// ─── CSV export ──────────────────────────────────────

export function escapeHtml(s: string): string {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportHistoryCSV(history: HistoryRecord[]) {
  let csv = "﻿สัปดาห์,วันที่,ยอดเปิดเงินสด,ยอดเปิดโอน,รายรับสด,รายรับโอน,รายจ่าย,ปิดสด,ปิดโอน,หมายเหตุ\n";
  history.forEach((h) => {
    csv += `${h.week},"${h.date_closed}",${h.open_cash},${h.open_online},${h.income_cash},${h.income_online},${h.expenses},${h.close_cash},${h.close_online},"${h.override_reason}"\n`;
  });
  downloadCSV(csv, "history_export.csv");
}

export function exportDonationCSV(rows: { name: string; method: string; tithe: number; rent: number; memorial: number; mission: number; special: number; land: number; party: number }[], weekIndex: number) {
  let csv = "﻿ลำดับ,ชื่อผู้ถวาย,สิบลด,ค่าเช่า,อนุสรณ์,พันธกิจ,ถวายพิเศษ,ที่ดิน,ปาร์ตี้,ช่องทาง\n";
  rows.forEach((r, i) => {
    csv += `${i + 1},"${r.name}",${r.tithe || 0},${r.rent || 0},${r.memorial || 0},${r.mission || 0},${r.special || 0},${r.land || 0},${r.party || 0},${r.method === "cash" ? "เงินสด" : "โอน"}\n`;
  });
  downloadCSV(csv, `weekly_income_${weekIndex}.csv`);
}
