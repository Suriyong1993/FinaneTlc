"use client";

const FAQS = [
  { q: "บันทึกรายรับ-รายจ่ายยังไง?", a: "ไปที่แท็บบันทึกรายรับฯ หรือบันทึกใบเบิกจ่ายเงิน กรอกข้อมูลและกดบันทึก แต่ละรายการจะตัดยอดในแดชบอร์ดทันที" },
  { q: "แนบใบเสร็จทำงานอย่างไร?", a: "ไปที่แท็บแนบใบเสร็จ แนบรูปพร้อมกรอกรายละเอียด รายการจะเข้ารอตรวจสอบ ต้องกดอนุมัติอีกครั้งก่อนบันทึกเข้าบัญชีจริง" },
  { q: "ปิดยอดวันอาทิตย์ทำไม?", a: "เพื่อกระทบยอดเงินสดจริงกับยอดในบัญชี ก่อนยกยอดคงเหลือไปสัปดาห์ถัดไป และล้างข้อมูลรายการให้เริ่มสัปดาห์ใหม่" },
  { q: "ตั้งค่า Webhook เพื่ออะไร?", a: "เมื่อกำหนด URL ระบบจะส่งข้อมูล JSON ออกไปทุกครั้งที่มีการบันทึก/ปิดยอด เพื่อเชื่อมต่อกับ Google Sheets หรือ Make.com" },
  { q: "ข้อมูลปลอดภัยไหม?", a: "ข้อมูลถูกเก็บในฐานข้อมูลบนคลาวด์ (Supabase) เข้าถึงผ่านการยืนยันตัวตนเท่านั้น ควรสำรองข้อมูลเป็นระยะ" },
];

export default function HelpTab() {
  return (
    <div className="bg-white rule rounded-sm p-6 space-y-5 hover-lift">
      <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <svg width="16" height="16" className="text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        คำถามที่พบบ่อย
      </h3>
      <div className="divide-y divide-rule">
        {FAQS.map((faq) => (
          <div key={faq.q} className="py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-semibold text-ink">{faq.q}</p>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
