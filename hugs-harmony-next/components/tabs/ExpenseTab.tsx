"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { formatMoney } from "@/lib/api";
import { Input } from "@/components/helpers";
import { showToast, EmptyState } from "@/components/ui";

export default function ExpenseTab() {
  const { state, addExpense, deleteExpense } = useApp();
  const [requester, setRequester] = useState("");
  const [payee, setPayee] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "bank">("cash");

  const handleAdd = async () => {
    if (!requester.trim() || !payee.trim() || !amount || Number(amount) <= 0) {
      showToast("กรุณากรอกข้อมูลให้ครบถ้วน!", "error");
      return;
    }
    await addExpense({
      requester: requester.trim(),
      payee: payee.trim(),
      purpose: purpose.trim() || "-",
      amount: Number(amount),
      method,
    });
    setRequester("");
    setPayee("");
    setPurpose("");
    setAmount("");
    showToast(`บันทึกใบเบิก ${formatMoney(Number(amount))} บาท`);
  };

  const handleDelete = async (idx: number) => {
    await deleteExpense(idx);
    showToast("ลบรายการเบิกจ่ายแล้ว");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form — ruled card */}
      <div className="bg-white rule rounded-sm p-5 h-fit space-y-4 hover-lift">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2 pb-2 rule-b">
          <svg width="16" height="16" className="text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          เขียนใบเบิกเงินใหม่
        </h3>
        <Input label="ชื่อผู้เบิกเงิน" value={requester} onChange={setRequester} placeholder="สุภาภรณ์ จิณวงษ์" />
        <Input label="จ่ายให้ / ผู้รับเงิน" value={payee} onChange={setPayee} placeholder="ปุณนา 277" />
        <Input label="วัตถุประสงค์" value={purpose} onChange={setPurpose} placeholder="ค่าพันธกิจในเมือง" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="จำนวนเงิน (บาท)" type="number" value={amount} onChange={setAmount} placeholder="0.00" />
          <div>
            <label htmlFor="exp-method" className="block text-[11px] font-semibold text-ink-muted mb-1">ช่องทาง</label>
            <select id="exp-method" value={method} onChange={(e) => setMethod(e.target.value as "cash" | "bank")} className="w-full border border-rule rounded-sm py-2 px-2 text-sm outline-none bg-white text-ink">
              <option value="cash">เงินสดในกล่อง</option>
              <option value="bank">โอนผ่านบัญชี</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={handleAdd} className="btn btn-danger w-full text-sm">
          บันทึกรายการเบิกเงิน
        </button>
      </div>

      {/* Log — ruled table */}
      <div className="lg:col-span-2 bg-white rule rounded-sm overflow-hidden flex flex-col">
        <div className="p-4 rule-b">
          <h3 className="text-sm font-bold text-ink">ล็อกการเบิกจ่าย</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          {state.expenseLogs.length === 0 ? (
            <EmptyState title="ยังไม่มีรายการ" description="เพิ่มรายการเบิกจ่ายทางด้านซ้าย" />
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-subtle text-ink-muted font-semibold rule-b">
                <tr>
                  <th className="py-2.5 px-3">วันที่</th>
                  <th className="py-2.5 px-3">ผู้เบิก</th>
                  <th className="py-2.5 px-3">วัตถุประสงค์</th>
                  <th className="py-2.5 px-3">ช่องทาง</th>
                  <th className="py-2.5 px-3 text-right">จำนวน</th>
                  <th className="py-2.5 px-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {state.expenseLogs.map((exp, idx) => (
                  <tr key={exp.id || `${exp.created_at}_${exp.requester}_${idx}`} className="hover:bg-paper-subtle">
                    <td className="py-2.5 px-3 text-ink-muted">{exp.created_at?.slice(0, 10) || "-"}</td>
                    <td className="py-2.5 px-3 font-semibold text-ink">{exp.requester}</td>
                    <td className="py-2.5 px-3 text-ink">{exp.purpose}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold ${exp.method === "cash" ? "bg-positive-soft text-positive" : "bg-info-soft text-info"}`}>
                        {exp.method === "cash" ? "เงินสด" : "ธนาคาร"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-ink tabular-nums">{formatMoney(exp.amount)}</td>
                    <td className="py-2.5 px-2 text-center">
                      <button type="button" onClick={() => handleDelete(idx)} className="p-1 text-ink-faint hover:text-negative transition-colors" aria-label="ลบรายการ">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
