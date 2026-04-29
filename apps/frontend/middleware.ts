import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value?.trim();
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!token && !isLoginPage) {
    const searchParams = new URLSearchParams();
    searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?${searchParams.toString()}`, request.url),
    );
  }

  if (token && isLoginPage) {
    const role = request.cookies.get("role")?.value;
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/";

    // Prevent redirecting back to login
    const targetUrl = callbackUrl.startsWith("/login") ? "/" : callbackUrl;

    // Redirect based on role
    if (role === "ADMIN" || role === "MANAGER") {
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    if (role === "EMPLOYEE") {
      // Employees should be restricted to cashier-related routes or their dashboard
      const isAllowedPath =
        targetUrl.startsWith("/cashier") || targetUrl.startsWith("/orders");
      return NextResponse.redirect(
        new URL(isAllowedPath ? targetUrl : "/cashier", request.url),
      );
    }

    // Default fall-back
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
