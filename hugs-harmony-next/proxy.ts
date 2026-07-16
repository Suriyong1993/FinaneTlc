import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STORAGE_KEY = "hugs_auth_token";
const PUBLIC_ROUTES = ["/login", "/api/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes + static assets unconditionally
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check auth cookie for everything else
  const authToken = request.cookies.get(STORAGE_KEY)?.value;
  if (authToken !== "1") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
