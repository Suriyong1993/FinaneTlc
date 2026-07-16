// Church Finance App — TypeScript Types

export interface Settings {
  id: number;
  church_name: string;
  church_website: string;
  weekly_note: string;
  webhook_url: string;
  week_index: number;
  opening_cash: number;
  opening_bank: number;
  cash: number;
  bank: number;
  updated_at: string;
}

export interface DonationRow {
  id?: number;
  week_index: number;
  name: string;
  method: "cash" | "online";
  tithe: number;
  rent: number;
  memorial: number;
  mission: number;
  special: number;
  land: number;
  party: number;
  created_at?: string;
}

export interface ExpenseLog {
  id?: number;
  week_index: number;
  requester: string;
  payee: string;
  purpose: string;
  amount: number;
  method: "cash" | "bank";
  created_at?: string;
}

export interface HistoryRecord {
  id?: number;
  week: number;
  date_closed: string;
  open_cash: number;
  open_online: number;
  income_cash: number;
  income_online: number;
  expenses: number;
  close_cash: number;
  close_online: number;
  override_reason: string;
  note: string;
  tithe: number;
  rent: number;
  memorial: number;
  mission: number;
  special: number;
  land: number;
  party: number;
  created_at?: string;
}

export interface Receipt {
  id?: number;
  week_index: number;
  donor_name: string;
  amount: number;
  fund: string;
  note: string;
  created_at?: string;
}

export type FundKey =
  | "tithe"
  | "rent"
  | "memorial"
  | "mission"
  | "special"
  | "land"
  | "party";

export const FUND_LABELS: Record<FundKey, string> = {
  tithe: "สิบลด",
  rent: "ค่าเช่าฯ",
  memorial: "อนุสรณ์ฯ",
  mission: "พันธกิจ",
  special: "ถวายพิเศษ",
  land: "ที่ดิน",
  party: "ปาร์ตี้",
};

export interface WebhookPayload {
  event: string;
  timestamp: string;
  weekIndex: number;
  payload: unknown;
}
