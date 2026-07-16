"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/helpers";
import { showToast, ConfirmDialog } from "@/components/ui";

export default function SettingsTab() {
  const { state, saveSettings, refresh, clearAllData } = useApp();
  const [url, setUrl] = useState(state.settings?.webhook_url ?? "");
  const [churchName, setChurchName] = useState(state.settings?.church_name ?? "");
  const [churchWebsite, setChurchWebsite] = useState(state.settings?.church_website ?? "");
  const [initCash, setInitCash] = useState(state.settings?.opening_cash ?? 0);
  const [initBank, setInitBank] = useState(state.settings?.opening_bank ?? 0);
  const [showReset, setShowReset] = useState(false);

  const handleSave = async () => {
    await saveSettings({
      webhook_url: url,
      church_name: churchName,
      church_website: churchWebsite,
      opening_cash: Number(initCash),
      opening_bank: Number(initBank),
    });
    await refresh();
    showToast("บันทึกการตั้งค่าเรียบร้อย!");
  };

  const handleClearData = async () => {
    setShowReset(false);
    try {
      await clearAllData();
      showToast("ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว");
    } catch {
      showToast("เกิดข้อผิดพลาดในการล้างข้อมูล", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Webhook + Opening section */}
      <div className="bg-white rule rounded-sm p-5 space-y-4 hover-lift">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2 pb-2 rule-b">
          <svg width="16" height="16" className="text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>
          Webhook / การเชื่อมต่อ
        </h3>
        <Input label="Webhook Target URL" type="url" value={url} onChange={setUrl} placeholder="https://hook.us1.make.com/..." className="font-mono text-[11px]" />
        <Input label="ยอดยกมาเงินสด" type="number" value={String(initCash)} onChange={(v) => setInitCash(Number(v))} />
        <Input label="ยอดยกมาเงินโอน" type="number" value={String(initBank)} onChange={(v) => setInitBank(Number(v))} />
      </div>

      {/* Church info + actions */}
      <div className="space-y-5">
        <div className="bg-white rule rounded-sm p-5 space-y-4 hover-lift">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2 pb-2 rule-b">
            <svg width="16" height="16" className="text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            ข้อมูลคริสตจักร
          </h3>
          <Input label="ชื่อคริสตจักร" value={churchName} onChange={setChurchName} placeholder="คริสตจักรชีวิตสุขสันต์กาฬสินธุ์" />
          <Input label="เว็บไซต์ / Facebook" type="url" value={churchWebsite} onChange={setChurchWebsite} placeholder="https://facebook.com/..." />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={handleSave} className="btn btn-primary text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            บันทึกค่าระบบ
          </button>
          <button type="button" onClick={() => setShowReset(true)} className="btn btn-danger text-xs">
            ล้างข้อมูลทั้งหมด
          </button>
        </div>
      </div>

      {showReset && (
        <ConfirmDialog
          open
          title="ล้างข้อมูลทั้งหมด?"
          message="รายรับ รายจ่าย ประวัติ และการตั้งค่าทั้งหมดจะถูกลบ ไม่สามารถกู้คืนได้"
          confirmText="ล้างข้อมูล"
          danger
          onConfirm={handleClearData}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  );
}
