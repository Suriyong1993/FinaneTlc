"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { formatMoney } from "@/lib/api";
import { Input } from "@/components/helpers";
import { showToast, EmptyState } from "@/components/ui";

export default function VerificationTab() {
  const { state } = useApp();
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [file, setFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [requester, setRequester] = useState("");
  const [payee, setPayee] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  const STORAGE_KEY = "hugs_pending_queue:v1";

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPendingItems(parsed);
        }
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingItems));
    } catch {
      // storage full or unavailable
    }
  }, [pendingItems]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFile({ name: f.name, dataUrl: ev.target?.result as string });
    reader.readAsDataURL(f);
  };

  const addToQueue = () => {
    if (!requester.trim() || !amount || Number(amount) <= 0) {
      showToast("กรุณากรอกผู้เบิกและจำนวนเงิน", "error");
      return;
    }
    const item = {
      id: "rc_" + Date.now(),
      fileName: file?.name ?? "",
      fileData: file?.dataUrl ?? "",
      date: new Date().toLocaleDateString("th-TH"),
      requester: requester.trim(),
      payee: payee.trim() || requester.trim(),
      purpose: purpose.trim() || "-",
      amount: Number(amount),
      method,
      status: "PENDING",
    };
    setPendingItems((prev) => [item, ...prev]);
    setRequester(""); setPayee(""); setPurpose(""); setAmount(""); setFile(null);
    showToast("ส่งรายการเข้าคิวรอตรวจสอบแล้ว");
  };

  const approve = (id: string) => {
    setPendingItems((prev) => prev.filter((i) => i.id !== id));
    showToast("อนุมัติและบันทึกบัญชีแล้ว");
  };

  const reject = (id: string) => {
    setPendingItems((prev) => prev.filter((i) => i.id !== id));
    showToast("ปฏิเสธรายการ", "info");
  };

  const updateField = (id: string, field: string, value: any) => {
    setPendingItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: field === "amount" ? Number(value) || 0 : value } : i))
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Form — ruled card */}
      <div className="lg:col-span-2 bg-white rule rounded-sm p-5 space-y-4 hover-lift">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <svg width="16" height="16" className="text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          แนบใบเสร็จใหม่
        </h3>

        <label className="cursor-pointer flex flex-col items-center gap-2 border-2 border-dashed border-rule hover:border-accent rounded-sm p-4 text-center transition-colors">
          {file?.dataUrl ? (
            <img src={file.dataUrl} className="max-h-24 rounded-sm object-contain" alt="preview" />
          ) : (
            <svg width="32" height="32" className="text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          )}
          <span className="text-[11px] font-semibold text-ink-muted">{file?.name ?? "แตะเพื่อเลือกรูปใบเสร็จ"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        <Input label="ผู้เบิกเงิน" value={requester} onChange={setRequester} />
        <Input label="ผู้รับเงิน" value={payee} onChange={setPayee} />
        <Input label="วัตถุประสงค์" value={purpose} onChange={setPurpose} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="จำนวนเงิน" type="number" value={amount} onChange={setAmount} />
          <div>
            <label htmlFor="verif-method" className="block text-[11px] font-semibold text-ink-muted mb-1">ช่องทาง</label>
            <select id="verif-method" value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border border-rule rounded-sm py-2 px-2 text-sm outline-none bg-white text-ink">
              <option value="cash">เงินสด</option>
              <option value="bank">โอน</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={addToQueue} className="btn btn-primary w-full text-sm">
          ส่งเข้าคิวรอตรวจสอบ
        </button>
      </div>

      {/* Queue — ruled column */}
      <div className="lg:col-span-3 bg-white rule rounded-sm overflow-hidden flex flex-col h-full max-h-[500px]">
        <div className="p-4 rule-b flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">กล่องคิวรอยืนยัน</h3>
          <span className="bg-accent-soft text-accent-strong text-[10px] font-bold px-2 py-0.5">{pendingItems.length} รายการ</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pendingItems.length === 0 ? (
            <EmptyState title="กล่องคิวว่าง" description="แนบใบเสร็จด้านซ้ายแล้วส่งเข้า queue" />
          ) : (
            pendingItems.map((item) => (
              <div key={item.id} className="bg-white rule rounded-sm p-4 space-y-3 hover:bg-paper-subtle transition-colors">
                <div className="flex items-start gap-3">
                  {item.fileData ? (
                    <img src={item.fileData} className="w-14 h-14 object-cover rounded-sm" alt="" />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center rounded-sm rule text-ink-faint">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                  )}
                  <span className="text-[10px] text-ink-muted font-semibold">{item.fileName || "ไม่มีไฟล์แนบ"}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs pt-2 rule-t">
                  <div>
                    <span className="text-[10px] text-ink-muted">ผู้เบิก</span>
                    <input value={item.requester} onChange={(e) => updateField(item.id, "requester", e.target.value)} className="font-semibold text-ink bg-paper-subtle px-1 py-0.5 rounded w-full text-xs" aria-label="ชื่อผู้เบิก" />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted">ยอด</span>
                    <input type="number" value={item.amount} onChange={(e) => updateField(item.id, "amount", e.target.value)} className="font-bold text-accent bg-paper-subtle px-1 py-0.5 rounded w-full text-xs" aria-label="จำนวนเงิน" />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => approve(item.id)} className="btn btn-primary flex-1 text-xs">อนุมัติ</button>
                  <button type="button" onClick={() => reject(item.id)} className="btn btn-ghost text-xs">ปฏิเสธ</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
