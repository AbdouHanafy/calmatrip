import { auth } from "@/auth";
import { NextResponse } from "next/server";



export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const isB2B = req.auth?.user?.role === "B2B";
  const homeSpace = isAdmin ? "/admin" : isB2B ? "/b2b" : "/dashboard";

  // Logged-in users landing on the wrong space get bounced to their own
  if (isLoggedIn && (pathname === "/dashboard" || pathname === "/admin" || pathname === "/b2b") && pathname !== homeSpace) {
    return NextResponse.redirect(new URL(homeSpace, req.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL(homeSpace, req.url));
    }
  }

  // Protect b2b routes
  if (pathname.startsWith("/b2b")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isB2B) {
      return NextResponse.redirect(new URL(homeSpace, req.url));
    }
  }

  // Protect dashboard route
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login/register
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL(homeSpace, req.url));
  }

  return NextResponse.next();
});

export const config = {
  runtime: "nodejs", // use Node.js instead of Edge
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/",
    "/admin/:path*",
    "/dashboard/:path*",
    "/b2b/:path*",
    "/login",
    "/register",
  ],
};