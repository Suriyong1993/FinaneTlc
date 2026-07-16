"use client";

import { ReactNode, useEffect, useState, Component, type ErrorInfo } from "react";

// ─── Error Boundary ─────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center px-6">
          <div className="w-10 h-10 bg-negative-soft rule rounded-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-ink">เกิดข้อผิดพลาดในระบบ</p>
          <p className="text-xs text-ink-muted max-w-sm">{this.state.error?.message || "โปรดลองรีเฟรชหน้าเว็บ"}</p>
          <button
            type="button"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="btn btn-primary mt-2"
          >
            รีเฟรช
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Loading Spinner ──────────────────────────────────

export function LoadingSpinner({ text = "กำลังโหลด..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-7 h-7 rule rounded-sm flex items-center justify-center">
        <svg className="w-4 h-4 text-ink-muted animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <p className="text-sm text-ink-muted">{text}</p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-6">
      <div className="w-10 h-10 bg-negative-soft rule rounded-sm flex items-center justify-center">
        <svg className="w-5 h-5 text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-ink">เกิดข้อผิดพลาด</p>
      <p className="text-xs text-ink-muted max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-sm hover:bg-accent-strong transition-colors"
        >
          ลองอีกครั้ง
        </button>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-2 text-center px-6">
      {icon ?? (
        <div className="w-8 h-8 rule rounded-sm flex items-center justify-center">
          <svg width="16" height="16" className="text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <p className="text-sm font-semibold text-ink-muted">{title}</p>
      <p className="text-xs text-ink-faint max-w-xs">{description}</p>
    </div>
  );
}

// ─── Toast System ─────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
let addToastFn: ((t: Omit<Toast, "id">) => void) | null = null;

export function showToast(
  message: string,
  type: "success" | "error" | "info" = "success"
) {
  addToastFn?.({ message, type });
}

export function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (t) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 3000);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 items-end pointer-events-none" role="status" aria-live="polite" style={{ zIndex: "var(--z-toast)" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`fade-in px-4 py-2.5 rule rounded-sm text-xs font-semibold flex items-center gap-2 pointer-events-auto shadow-md ${
            t.type === "success"
              ? "text-positive bg-white"
              : t.type === "error"
              ? "text-negative bg-white"
              : "text-info bg-white"
          }`}
        >
          {t.type === "success" && (
            <svg className="w-4 h-4 text-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {t.type === "error" && (
            <svg className="w-4 h-4 text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "ยืนยัน",
  danger = false,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rule rounded-sm p-6 max-w-sm w-full mx-4 fade-in shadow-md">
        <h3 className="font-bold text-ink text-sm mb-2">{title}</h3>
        <p className="text-xs text-ink-muted mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={danger ? "btn btn-danger" : "btn btn-primary"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
