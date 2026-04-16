import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * IDENTITY PROXY
 *
 * The httpOnly `token` cookie is set by the API on a different domain
 * and is NOT readable here in Next.js middleware.
 * We use the `user_role` cookie for routing decisions instead.
 * The actual security is enforced by the httpOnly token on every API call.
 */
export function proxy(request: NextRequest) {
  const roleCookie = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!roleCookie && roleCookie.length > 0;

  // Public landing page — never redirect
  if (pathname === "/") return NextResponse.next();

  // Prevent redirect loops
  if (pathname === "/dashboard/home") return NextResponse.next();

  const authPaths = [
    "/login",
    "/register",
    "/signup",
    "/set-password",
    "/staff/login",
    "/staff/set-password",
    "/staff/forgot-password",
    "/staff/reset-password",
    "/verify",
  ];

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isDashboardPath = pathname.startsWith("/dashboard");

  // Block unauthenticated users from the dashboard
  if (isDashboardPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated users hitting auth pages → send to dashboard
  if (isAuthenticated && (isAuthPage || pathname === "/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url));
  }

  return NextResponse.next();
}