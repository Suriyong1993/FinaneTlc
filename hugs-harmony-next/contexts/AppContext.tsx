"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import type {
  Settings,
  DonationRow,
  ExpenseLog,
  HistoryRecord,
  FundKey,
} from "@/types";
import * as api from "@/lib/api";

// ─── State ────────────────────────────────────────────

interface AppState {
  loading: boolean;
  error: string | null;
  settings: Settings | null;
  donationRows: DonationRow[];
  expenseLogs: ExpenseLog[];
  history: HistoryRecord[];
  weekIndex: number;
  openingCash: number;
  openingBank: number;
  cash: number;
  bank: number;
}

const initialState: AppState = {
  loading: true,
  error: null,
  settings: null,
  donationRows: [],
  expenseLogs: [],
  history: [],
  weekIndex: 1,
  openingCash: 0,
  openingBank: 0,
  cash: 0,
  bank: 0,
};

// ─── Actions ──────────────────────────────────────────

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_STATE"; payload: AppState }
  | { type: "SET_DONATION_ROWS"; payload: DonationRow[] }
  | { type: "SET_EXPENSE_LOGS"; payload: ExpenseLog[] }
  | { type: "ADD_EXPENSE"; payload: ExpenseLog }
  | { type: "DELETE_EXPENSE"; payload: number }
  | { type: "SET_HISTORY"; payload: HistoryRecord[] }
  | { type: "ADD_HISTORY"; payload: HistoryRecord }
  | { type: "UPDATE_SETTINGS"; payload: Partial<Settings> }
  | { type: "CALCULATE_TOTALS" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOAD_STATE":
      return { ...state, ...action.payload, loading: false, error: null };
    case "SET_DONATION_ROWS":
      return { ...state, donationRows: action.payload };
    case "SET_EXPENSE_LOGS":
      return { ...state, expenseLogs: action.payload };
    case "ADD_EXPENSE":
      return { ...state, expenseLogs: [...state.expenseLogs, action.payload] };
    case "DELETE_EXPENSE": {
      const logs = state.expenseLogs.filter((_, i) => i !== action.payload);
      return { ...state, expenseLogs: logs };
    }
    case "SET_HISTORY":
      return { ...state, history: action.payload };
    case "ADD_HISTORY":
      return { ...state, history: [action.payload, ...state.history] };
    case "UPDATE_SETTINGS":
      return state.settings
        ? { ...state, settings: { ...state.settings, ...action.payload } }
        : state;
    case "CALCULATE_TOTALS": {
      const { donationRows, expenseLogs, openingCash, openingBank } = state;
      let cashIncome = 0;
      let onlineIncome = 0;
      donationRows.forEach((r) => {
        const t =
          r.tithe + r.rent + r.memorial + r.mission + r.special + r.land + r.party;
        if (r.method === "cash") cashIncome += t;
        else onlineIncome += t;
      });
      let cashExpense = 0;
      let bankExpense = 0;
      expenseLogs.forEach((e) => {
        if (e.method === "cash") cashExpense += e.amount;
        else bankExpense += e.amount;
      });
      return {
        ...state,
        cash: openingCash + cashIncome - cashExpense,
        bank: openingBank + onlineIncome - bankExpense,
      };
    }
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  refresh: () => Promise<void>;
  saveDonationRows: (rows: DonationRow[]) => Promise<void>;
  addExpense: (exp: Omit<ExpenseLog, "id" | "week_index" | "created_at">) => Promise<void>;
  deleteExpense: (index: number) => Promise<void>;
  executeRollover: (note: string, overrideReason: string) => Promise<void>;
  saveSettings: (s: Partial<Settings>) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ─────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { weekIndex, openingCash, openingBank, cash, bank, donationRows, expenseLogs, settings } = state;

  const refresh = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [settings, donationRows, expenseLogs, history] = await Promise.all([
        api.getSettings(),
        api.getDonationRows(),
        api.getExpenseLogs(),
        api.getHistory(),
      ]);

      const weekIndex = settings?.week_index ?? 1;
      const openingCash = settings?.opening_cash ?? 0;
      const openingBank = settings?.opening_bank ?? 0;

      // Compute running totals
      let cashIncome = 0;
      let onlineIncome = 0;
      donationRows.forEach((r) => {
        const t = r.tithe + r.rent + r.memorial + r.mission + r.special + r.land + r.party;
        if (r.method === "cash") cashIncome += t;
        else onlineIncome += t;
      });
      let cashExpense = 0;
      let bankExpense = 0;
      expenseLogs.forEach((e) => {
        if (e.method === "cash") cashExpense += e.amount;
        else bankExpense += e.amount;
      });

      dispatch({
        type: "LOAD_STATE",
        payload: {
          loading: false,
          error: null,
          settings,
          donationRows,
          expenseLogs,
          history,
          weekIndex,
          openingCash,
          openingBank,
          cash: openingCash + cashIncome - cashExpense,
          bank: openingBank + onlineIncome - bankExpense,
        },
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Failed to load data",
      });
    }
  }, []);

  const saveDonationRows = useCallback(
    async (rows: DonationRow[]) => {
      await api.saveDonationRows(rows, weekIndex);
      dispatch({ type: "SET_DONATION_ROWS", payload: rows });
      dispatch({ type: "CALCULATE_TOTALS" });
      await api.fireWebhook(settings?.webhook_url ?? "", "INCOME_SAVED", {
        donationRows: rows,
      });
    },
    [weekIndex, settings?.webhook_url]
  );

  const addExpense = useCallback(
    async (exp: Omit<ExpenseLog, "id" | "week_index" | "created_at">) => {
      const saved = await api.addExpenseLog({ ...exp, week_index: weekIndex });
      dispatch({ type: "ADD_EXPENSE", payload: saved });
      dispatch({ type: "CALCULATE_TOTALS" });
      await api.fireWebhook(settings?.webhook_url ?? "", "EXPENSE_ADDED", saved);
    },
    [weekIndex, settings?.webhook_url]
  );

  const deleteExpense = useCallback(
    async (index: number) => {
      const log = expenseLogs[index];
      if (log?.id) await api.deleteExpenseLog(log.id);
      dispatch({ type: "DELETE_EXPENSE", payload: index });
      dispatch({ type: "CALCULATE_TOTALS" });
    },
    [expenseLogs]
  );

  const executeRollover = useCallback(
    async (note: string, overrideReason: string) => {
      await api.closeWeek(
        weekIndex,
        openingCash,
        openingBank,
        cash,
        bank,
        donationRows,
        expenseLogs,
        overrideReason,
        note
      );
      await api.fireWebhook(settings?.webhook_url ?? "", "WEEK_CLOSED", {
        week: weekIndex,
      });
      await refresh();
    },
    [weekIndex, openingCash, openingBank, cash, bank, donationRows, expenseLogs, settings?.webhook_url, refresh]
  );

  const saveSettings = useCallback(
    async (s: Partial<Settings>) => {
      await api.updateSettings(s);
      dispatch({ type: "UPDATE_SETTINGS", payload: s });
    },
    []
  );

  const clearAllData = useCallback(async () => {
    await api.clearAllData();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        refresh,
        saveDonationRows,
        addExpense,
        deleteExpense,
        executeRollover,
        saveSettings,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
