// Church Finance App — Supabase API layer
// Reads/writes directly to Supabase from client (bypassing Next.js API routes)

import { supabase } from "./supabase";
import type {
  Settings,
  DonationRow,
  ExpenseLog,
  HistoryRecord,
  FundKey,
} from "@/types";

// ─── Settings ─────────────────────────────────────────

export async function getSettings(): Promise<Settings | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSettings(
  updates: Partial<Settings>
): Promise<void> {
  const { error } = await supabase
    .from("settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw error;
}

// ─── Donation Rows ────────────────────────────────────

export async function getDonationRows(): Promise<DonationRow[]> {
  const { data, error } = await supabase
    .from("donation_rows")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getDonationRowsByWeek(
  week: number
): Promise<DonationRow[]> {
  const { data, error } = await supabase
    .from("donation_rows")
    .select("*")
    .eq("week_index", week)
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveDonationRows(
  rows: { name: string; method: string; tithe: number; rent: number; memorial: number; mission: number; special: number; land: number; party: number }[],
  weekIndex: number
): Promise<void> {
  // Save old row IDs before deleting (for rollback safety)
  const { data: oldRows, error: fetchErr } = await supabase
    .from("donation_rows")
    .select("id")
    .eq("week_index", weekIndex);
  if (fetchErr) throw fetchErr;

  const oldIds = oldRows?.map((r) => r.id) ?? [];

  // Delete old rows
  if (oldIds.length > 0) {
    const { error: delErr } = await supabase
      .from("donation_rows")
      .delete()
      .in("id", oldIds);
    if (delErr) throw delErr;
  }

  // Insert new rows
  if (rows.length === 0) return;

  const inserts = rows.map((r) => ({
    week_index: weekIndex,
    name: r.name,
    method: r.method === "online" ? "online" : "cash",
    tithe: Number(r.tithe) || 0,
    rent: Number(r.rent) || 0,
    memorial: Number(r.memorial) || 0,
    mission: Number(r.mission) || 0,
    special: Number(r.special) || 0,
    land: Number(r.land) || 0,
    party: Number(r.party) || 0,
  }));

  const { error: insErr } = await supabase
    .from("donation_rows")
    .insert(inserts);
  if (insErr) throw insErr;
}

// ─── Expense Logs ─────────────────────────────────────

export async function getExpenseLogs(): Promise<ExpenseLog[]> {
  const { data, error } = await supabase
    .from("expense_logs")
    .select("*")
    .order("id", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addExpenseLog(
  exp: Omit<ExpenseLog, "id" | "created_at">
): Promise<ExpenseLog> {
  const { data, error } = await supabase
    .from("expense_logs")
    .insert({
      week_index: exp.week_index,
      requester: exp.requester,
      payee: exp.payee,
      purpose: exp.purpose,
      amount: Number(exp.amount) || 0,
      method: exp.method,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpenseLog(id: number): Promise<void> {
  const { error } = await supabase
    .from("expense_logs")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ─── History ──────────────────────────────────────────

export async function getHistory(): Promise<HistoryRecord[]> {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("week", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ─── Close Week (Rollover) ────────────────────────────

export async function closeWeek(
  weekIndex: number,
  openCash: number,
  openOnline: number,
  closeCash: number,
  closeOnline: number,
  donationRows: DonationRow[],
  expenseLogs: ExpenseLog[],
  overrideReason: string,
  note: string
): Promise<void> {
  let liveCashIn = 0;
  let liveOnlineIn = 0;
  const funds: Record<FundKey, number> = {
    tithe: 0,
    rent: 0,
    memorial: 0,
    mission: 0,
    special: 0,
    land: 0,
    party: 0,
  };

  donationRows.forEach((row) => {
    const total =
      (row.tithe || 0) +
      (row.rent || 0) +
      (row.memorial || 0) +
      (row.mission || 0) +
      (row.special || 0) +
      (row.land || 0) +
      (row.party || 0);
    if (row.method === "cash") liveCashIn += total;
    else liveOnlineIn += total;
    (Object.keys(funds) as FundKey[]).forEach(
      (key) => (funds[key] += row[key] || 0)
    );
  });

  let totalExp = 0;
  expenseLogs.forEach((e) => (totalExp += e.amount));

  const now = new Date().toLocaleDateString("th-TH", {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Insert history record
  const { error: histErr } = await supabase.from("history").insert({
    week: weekIndex,
    date_closed: now,
    open_cash: openCash,
    open_online: openOnline,
    income_cash: liveCashIn,
    income_online: liveOnlineIn,
    expenses: totalExp,
    close_cash: closeCash,
    close_online: closeOnline,
    override_reason: overrideReason || "ตรงกัน",
    note,
    ...funds,
  });
  if (histErr) throw histErr;

  // Update settings: advance week, carry balances
  const { error: setErr } = await supabase
    .from("settings")
    .update({
      week_index: weekIndex + 1,
      opening_cash: closeCash,
      opening_bank: closeOnline,
      cash: closeCash,
      bank: closeOnline,
      weekly_note: "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (setErr) throw setErr;

  // Clear donation rows and expense logs for old week
  await supabase.from("donation_rows").delete().eq("week_index", weekIndex);
  await supabase.from("expense_logs").delete().eq("week_index", weekIndex);
}

// ─── Clear All Data ────────────────────────────────────

export async function clearAllData(): Promise<void> {
  const { error: delDonations } = await supabase
    .from("donation_rows")
    .delete()
    .neq("id", 0);
  if (delDonations) throw delDonations;

  const { error: delExpenses } = await supabase
    .from("expense_logs")
    .delete()
    .neq("id", 0);
  if (delExpenses) throw delExpenses;

  const { error: delHistory } = await supabase
    .from("history")
    .delete()
    .neq("id", 0);
  if (delHistory) throw delHistory;

  // Reset settings to defaults
  const { error: resetSettings } = await supabase
    .from("settings")
    .update({
      week_index: 1,
      opening_cash: 0,
      opening_bank: 0,
      cash: 0,
      bank: 0,
      weekly_note: "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (resetSettings) throw resetSettings;
}

// ─── Webhook ──────────────────────────────────────────

export async function fireWebhook(
  url: string,
  event: string,
  payload: unknown
): Promise<void> {
  if (!url) return;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        payload,
      }),
      signal: controller.signal,
    });
  } catch {
    // Silent fail — webhook is optional
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Format Helpers ───────────────────────────────────

export function formatMoney(val: number): string {
  return Number(val).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calcRowTotal(row: DonationRow): number {
  return (
    (row.tithe || 0) +
    (row.rent || 0) +
    (row.memorial || 0) +
    (row.mission || 0) +
    (row.special || 0) +
    (row.land || 0) +
    (row.party || 0)
  );
}
