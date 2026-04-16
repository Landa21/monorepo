import { NextRequest } from "next/server";
import { proxy } from "../proxy";

/**
 * This file is the Next.js middleware entry point.
 * All logic lives in proxy.ts — this just connects it.
 */
export function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};