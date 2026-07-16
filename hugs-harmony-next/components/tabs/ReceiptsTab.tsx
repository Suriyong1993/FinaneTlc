"use client";

import { useApp } from "@/contexts/AppContext";
import { formatMoney, calcRowTotal } from "@/lib/api";
import { escapeHtml } from "@/components/helpers";
import { FUND_LABELS } from "@/types";
import { EmptyState } from "@/components/ui";
import type { FundKey, DonationRow } from "@/types";

function printReceipt(row: DonationRow, churchName: string, weekIndex: number) {
  const total = calcRowTotal(row);
  const today = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  const w = window.open("", "_blank", "width=500,height=700");
  if (!w) return;
  w.document.write(`
    <html><head><meta charset="utf-8"><title>ใบอนุโมทนา</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Sarabun:wght@400;600;700&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Sarabun', 'Inter', sans-serif; padding: 0; color: #292524; background: #fbf9f7; }
      .receipt { max-width: 420px; margin: 0 auto; }
      .ornament-top { background-image: radial-gradient(circle, #e7e5e4 1px, transparent 1px); background-size: 8px 8px; height: 8px; }
      .box { border: 1px solid #e7e5e4; border-top: none; padding: 36px 32px; background: white; }
      .seal { width: 48px; height: 48px; margin: 0 auto 16px; border: 2px solid #d97706; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #d97706; }
      h1 { font-size: 22px; font-weight: 800; text-align: center; letter-spacing: -0.02em; margin-bottom: 2px; }
      .sub { color: #78716c; font-size: 12px; text-align: center; margin-bottom: 24px; }
      .donor-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
      .donor-label { color: #78716c; }
      .donor-value { font-weight: 600; }
      .divider { border: none; border-top: 1px solid #e7e5e4; margin: 4px 0 12px; }
      .receipt-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px; }
      .receipt-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #a8a29e; padding-bottom: 6px; border-bottom: 1px solid #e7e5e4; }
      .receipt-table td { padding: 6px 0; border-bottom: 1px solid #f0ede9; }
      .receipt-table .amt { text-align: right; font-variant-numeric: tabular-nums; }
      .receipt-table .total td { border-top: 2px solid #292524; border-bottom: none; font-weight: 700; padding-top: 10px; font-size: 15px; }
      .receipt-table .total .amt { font-size: 16px; font-weight: 800; }
      .method-badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 1px 8px; border-radius: 2px; margin-top: 4px; }
      .method-cash { background: #f0fdf4; color: #166534; }
      .method-online { background: #eff6ff; color: #1e40af; }
      .ornament-bottom { background-image: radial-gradient(circle, #e7e5e4 1px, transparent 1px); background-size: 8px 8px; height: 8px; }
      .footer { text-align: center; padding: 16px 32px; font-size: 11px; color: #a8a29e; letter-spacing: 0.02em; }
      .blessing { text-align: center; margin-top: 24px; font-size: 13px; color: #78716c; font-weight: 600; }
    </style></head>
    <body onload="window.print()">
      <div class="receipt">
        <div class="ornament-top"></div>
        <div class="box">
          <div class="seal">†</div>
          <h1>ใบอนุโมทนา</h1>
          <p class="sub">${escapeHtml(churchName)} — ${today} (สัปดาห์ที่ ${weekIndex})</p>
          <hr class="divider">
          <div class="donor-row"><span class="donor-label">ผู้ถวาย</span><span class="donor-value">${escapeHtml(row.name)}</span></div>
          <div class="donor-row"><span class="donor-label">ช่องทาง</span><span class="donor-value"><span class="method-badge ${row.method === "cash" ? "method-cash" : "method-online"}">${row.method === "cash" ? "เงินสด" : "โอน"}</span></span></div>
          <table class="receipt-table">
            <tr><th>รายการ</th><th class="amt">จำนวนเงิน</th></tr>
            ${(["tithe","rent","memorial","mission","special","land","party"] as FundKey[]).filter(f => (row[f] || 0) > 0).map(f => `<tr><td>${escapeHtml(FUND_LABELS[f])}</td><td class="amt">${formatMoney(row[f] || 0)}</td></tr>`).join("")}
            <tr class="total"><td>รวมทั้งสิ้น</td><td class="amt">${formatMoney(total)}</td></tr>
          </table>
          <div class="blessing">ขอพระเจ้าทรงอวยพระพร</div>
        </div>
        <div class="ornament-bottom"></div>
        <div class="footer">เอกสารนี้ใช้เป็นหลักฐานในการลดหย่อนภาษี</div>
      </div>
    </body></html>
  `);
  w.document.close();
}

export default function ReceiptsTab() {
  const { state } = useApp();
  const donors = state.donationRows.filter((r) => r.name.trim());

  if (donors.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="32" height="32" className="text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        }
        title="ยังไม่มีรายชื่อผู้ถวาย"
        description="กรอกข้อมูลในแท็บบันทึกรายรับประจำสัปดาห์ก่อน"
      />
    );
  }

  return (
    <div className="bg-white rule rounded-sm overflow-hidden">
      <div className="p-4 rule-b">
        <h3 className="text-sm font-bold text-ink">ออกใบอนุโมทนาประจำสัปดาห์นี้</h3>
      </div>
      <table className="w-full text-left text-xs">
        <thead className="bg-paper-subtle text-ink-muted font-semibold rule-b">
          <tr>
            <th className="py-2.5 px-4">ชื่อผู้ถวาย</th>
            <th className="py-2.5 px-4 text-right">ยอดรวม</th>
            <th className="py-2.5 px-4 text-center">ช่องทาง</th>
            <th className="py-2.5 px-4 text-center w-28">ใบเสร็จ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {donors.map((row) => {
            const total = calcRowTotal(row);
            const realIdx = state.donationRows.indexOf(row);
            return (
              <tr key={row.id || row.name} className="hover:bg-paper-subtle">
                <td className="py-3 px-4 font-semibold text-ink">{row.name}</td>
                <td className="py-3 px-4 text-right font-bold tabular-nums">{formatMoney(total)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-[10px] font-medium ${row.method === "cash" ? "text-positive" : "text-info"}`}>
                    {row.method === "cash" ? "เงินสด" : "โอน"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => printReceipt(state.donationRows[realIdx], state.settings?.church_name || "คริสตจักร", state.weekIndex)}
                    className="text-[11px] font-semibold text-accent hover:text-accent-strong flex items-center gap-1 mx-auto"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    พิมพ์
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
