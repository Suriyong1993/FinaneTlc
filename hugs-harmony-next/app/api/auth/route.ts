import { NextResponse } from "next/server";

// Simple in-memory rate limit (per process — resets on each cold start)
const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000; // 1 minute

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit check
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now < record.resetAt && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { ok: false, error: "ลองใหม่ใน 1 นาที" },
      { status: 429 }
    );
  }

  // Update attempt counter
  if (!record || now >= record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    record.count++;
  }

  try {
    const { password } = await request.json();
    const expected = process.env.CHURCH_APP_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "CHURCH_APP_PASSWORD not configured" },
        { status: 503 }
      );
    }

    // Artificial delay to slow brute-force (100-300ms)
    await new Promise((r) => setTimeout(r, 150 + Math.random() * 150));

    if (password === expected) {
      // Reset counter on success
      attempts.delete(ip);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
