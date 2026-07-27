import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protected route prefixes
  const isPatientRoute = pathname.startsWith("/patient");
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isPatientRoute && !isDoctorRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let userRole: string | null = null;

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie));
      userRole = parsed.role;
    } catch {
      userRole = null;
    }
  }

  // Redirect to login if unauthenticated or accessing wrong role area
  if (isPatientRoute && userRole !== "patient") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("role", "patient");
    loginUrl.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(loginUrl);
  }

  if (isDoctorRoute && userRole !== "doctor") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("role", "doctor");
    loginUrl.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && userRole !== "admin") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("role", "admin");
    loginUrl.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*"],
};
