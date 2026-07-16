"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { formatMoney } from "@/lib/api";
import { Row } from "@/components/helpers";
import { showToast } from "@/components/ui";

const PHYSICAL = [
  { id: "1000", label: "1000", bg: "bg-stone-200" },
  { id: "500", label: "500", bg: "bg-purple-200" },
  { id: "100", label: "100", bg: "bg-red-200" },
  { id: "50", label: "50", bg: "bg-blue-200" },
  { id: "20", label: "20", bg: "bg-green-200" },
  { id: "coin10", label: "10 บ.", bg: "bg-stone-300" },
  { id: "coin5", label: "5 บ.", bg: "bg-stone-300" },
  { id: "coin2", label: "2 บ.", bg: "bg-stone-300" },
  { id: "coin1", label: "1 บ.", bg: "bg-stone-300" },
  { id: "coinSub", label: "สตางค์", bg: "bg-amber-100" },
];

const VALUE_MAP: Record<string, number> = {
  "1000": 1000, "500": 500, "100": 100, "50": 50, "20": 20,
  "coin10": 10, "coin5": 5, "coin2": 2, "coin1": 1, "coinSub": 1,
};

export default function RolloverTab() {
  const { state, executeRollover } = useApp();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [overrideReason, setOverrideReason] = useState("");

  const actualTotal = PHYSICAL.reduce((sum, p) => sum + (counts[p.id] || 0) * (VALUE_MAP[p.id] || 0), 0);
  const expected = state.cash;
  const variance = actualTotal - expected;
  const isMatching = Math.abs(variance) < 0.01;
  const hasInput = actualTotal > 0;

  const handleRollover = async () => {
    await executeRollover(state.settings?.weekly_note ?? "", overrideReason);
    setCounts({});
    setOverrideReason("");
    showToast("ปิดรอบบัญชีสำเร็จ!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Counter */}
      <div className="lg:col-span-2 bg-white rule rounded-sm overflow-hidden hover-lift">
        <div className="p-4 rule-b">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <svg width="16" height="16" className="text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            เครื่องคิดเลขนับธนบัตรและเหรียญ
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PHYSICAL.map((p) => (
            <div key={p.id} className="flex items-center gap-2 bg-paper-subtle p-2 rounded-sm rule">
              <div className={`w-14 text-center text-xs font-bold ${p.bg} text-ink rounded-sm py-1.5`}>{p.label}</div>
              <input
                type="number"
                min={0}
                value={counts[p.id] ?? ""}
                onChange={(e) => setCounts((prev) => ({ ...prev, [p.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                placeholder="จำนวน"
                className="w-full bg-white border border-rule p-1.5 text-right text-sm rounded-sm outline-none font-semibold tabular-nums"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rule rounded-sm p-5 space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">กระทบยอดเงินสด</h3>
          <p className="text-[11px] text-ink-muted">เปรียบเทียบยอดนับจริงกับยอดในบัญชี</p>
        </div>

        <div className="space-y-3 pt-3 rule-t">
          <Row label="ยอดในบัญชี:" value={formatMoney(expected)} />
          <Row label="ยอดนับจริง:" value={formatMoney(actualTotal)} />
          <div className={`flex justify-between items-center p-3 rounded-sm text-sm font-bold ${isMatching ? "bg-positive-soft text-positive" : hasInput ? "bg-negative-soft text-negative" : "bg-paper-subtle text-ink-muted"}`}>
            <span>ผลต่าง:</span>
            <span className="tabular-nums">{hasInput ? `${variance > 0 ? "+" : ""}${formatMoney(variance)}` : "-"}</span>
          </div>
        </div>

        {!isMatching && hasInput && (
          <div className="space-y-2 p-3 bg-accent-soft rule rounded-sm">
            <label htmlFor="variance-reason" className="block text-[11px] font-bold text-accent-strong">บันทึกคำอธิบายส่วนต่าง</label>
            <input
              id="variance-reason"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="เช่น เงินทอนผิดพลาดสะสม"
              className="w-full border border-accent rounded-sm p-2 text-xs outline-none bg-white text-ink"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleRollover}
          disabled={!hasInput}
          className={`btn w-full text-sm ${!hasInput ? '' : isMatching ? 'btn-primary' : 'btn-danger'}`}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          {hasInput ? (isMatching ? "ยอดตรงกัน! กดปิดบัญชีสัปดาห์" : "บันทึกปิดงวด (มีส่วนต่าง)") : "กรอกจำนวนเงินสดก่อน..."}
        </button>
      </div>
    </div>
  );
}
