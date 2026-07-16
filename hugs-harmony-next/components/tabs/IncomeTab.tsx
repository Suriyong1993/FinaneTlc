"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { formatMoney, calcRowTotal } from "@/lib/api";
import { FUND_KEYS, exportDonationCSV } from "@/components/helpers";
import { showToast } from "@/components/ui";
import type { DonationRow, FundKey } from "@/types";

const FUND_COL_HEADERS: Record<FundKey, string> = {
  tithe: "สิบลด",
  rent: "ค่าเช่า",
  memorial: "อนุสรณ์",
  mission: "พันธกิจ",
  special: "พิเศษ",
  land: "ที่ดิน",
  party: "ปาร์ตี้",
};

interface ClientDonationRow extends DonationRow {
  _key: string;
}

function emptyRow(weekIndex: number): ClientDonationRow {
  return {
    _key: Math.random().toString(36).substring(2, 9),
    week_index: weekIndex,
    name: "",
    method: "cash",
    tithe: 0, rent: 0, memorial: 0, mission: 0, special: 0, land: 0, party: 0,
  };
}

export default function IncomeTab() {
  const { state, saveDonationRows } = useApp();
  const [rows, setRows] = useState<ClientDonationRow[]>(() =>
    state.donationRows.length > 0
      ? state.donationRows.map((r) => ({
          ...r,
          _key: r.id ? String(r.id) : Math.random().toString(36).substring(2, 9),
        }))
      : [emptyRow(state.weekIndex), emptyRow(state.weekIndex), emptyRow(state.weekIndex)]
  );

  const updateRow = (idx: number, field: keyof DonationRow, value: string) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === idx
          ? { ...r, [field]: field === "name" || field === "method" ? value : Number(value) || 0 }
          : r
      )
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow(state.weekIndex)]);
  const deleteRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    // Strip client-only keys before saving
    const toSave = rows.map(({ _key, ...r }) => r);
    await saveDonationRows(toSave);
    showToast("บันทึกใบสรุปรายรับเรียบร้อย!");
  };

  const clearTable = () => setRows([emptyRow(state.weekIndex)]);

  // Totals
  const totals = { tithe: 0, rent: 0, memorial: 0, mission: 0, special: 0, land: 0, party: 0, total: 0 };
  let cashTotal = 0, onlineTotal = 0;
  rows.forEach((r) => {
    FUND_KEYS.forEach((f) => (totals[f] += r[f] || 0));
    const rt = calcRowTotal(r);
    totals.total += rt;
    if (r.method === "cash") cashTotal += rt;
    else onlineTotal += rt;
  });

  return (
    <>
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 rule-b pb-4">
        <h2 className="text-xs font-semibold text-ink-faint uppercase tracking-widest">
          ใบตรวจนับเงินแยกรายการ
        </h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleSave} className="btn btn-primary text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            บันทึก
          </button>
          <button type="button" onClick={() => exportDonationCSV(rows, state.weekIndex)} className="btn btn-secondary text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            CSV
          </button>
          <button type="button" onClick={clearTable} className="btn btn-ghost text-xs">
            เคลียร์
          </button>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="bg-white rule rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="thead-dark">
                <th className="py-2.5 px-2 text-center w-10">#</th>
                <th className="py-2.5 px-3 min-w-[130px]">ชื่อ</th>
                {FUND_KEYS.map((f) => (
                  <th key={f} className="py-2.5 px-2 text-right">{FUND_COL_HEADERS[f]}</th>
                ))}
                <th className="py-2.5 px-2 text-center w-[80px]">ช่องทาง</th>
                <th className="py-2.5 px-3 text-right w-[80px]">รวม</th>
                <th className="py-2.5 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const rt = calcRowTotal(row);
                return (
                  <tr key={row._key} className="border-b border-rule hover:bg-paper-subtle transition-colors">
                    <td className="py-2 px-2 text-center font-bold text-ink-faint">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(idx, "name", e.target.value)}
                        placeholder="ชื่อผู้ถวาย..."
                        className="w-full bg-transparent outline-none font-medium text-ink"
                      />
                    </td>
                    {FUND_KEYS.map((f) => (
                      <td key={f} className="py-2 px-2">
                        <input
                          type="number"
                          value={row[f] || ""}
                          onChange={(e) => updateRow(idx, f, e.target.value)}
                          placeholder="-"
                          className="w-full bg-transparent text-right outline-none font-semibold text-ink tabular-nums"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center">
                      <select
                        value={row.method}
                        onChange={(e) => updateRow(idx, "method", e.target.value)}
                        className="bg-paper-subtle hover:bg-rule py-1 px-1.5 rounded-sm text-[10px] font-semibold outline-none text-ink-muted transition-colors"
                      >
                        <option value="cash">เงินสด</option>
                        <option value="online">โอน</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-right font-extrabold text-info bg-info-soft tabular-nums">
                      {formatMoney(rt)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button type="button" onClick={() => deleteRow(idx)} className="p-1 text-ink-faint hover:text-negative transition-colors" aria-label="ลบแถว">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-paper-subtle font-bold text-ink text-xs">
                <td colSpan={2} className="py-2.5 px-3 text-center bg-rule">รวมทั้งสิ้น</td>
                {FUND_KEYS.map((f) => (
                  <td key={f} className="py-2.5 px-2 text-right tabular-nums">{formatMoney(totals[f])}</td>
                ))}
                <td className="py-2.5 px-2 text-center text-[10px] text-ink-muted">คำนวณ</td>
                <td className="py-2.5 px-3 text-right bg-info-soft text-info font-extrabold tabular-nums">{formatMoney(totals.total)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-paper-subtle rule-t flex items-center justify-between">
          <button type="button" onClick={addRow} className="flex items-center gap-1.5 bg-white border border-rule hover:bg-paper-subtle text-ink font-semibold py-1.5 px-3 rounded-sm text-xs transition-colors">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            เพิ่มแถว
          </button>
          <span className="meta-text">
            เงินสด: <strong className="text-positive">{formatMoney(cashTotal)}</strong> | โอน: <strong className="text-info">{formatMoney(onlineTotal)}</strong>
          </span>
        </div>
      </div>
    </>
  );
}
