import { auth } from "@/auth";
import { NextResponse } from "next/server";



export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Admin → always redirect to /admin
  if (isLoggedIn && isAdmin && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/dashboard", req.url)
    );
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
    "/login",
    "/register",
  ],
};