import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { isAdminWorkspaceRole } from "@/lib/access";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdmin = isAdminWorkspaceRole(role);
  const isB2B = req.auth?.user?.role === "B2B";
  const adminHome =
    role === "ADMIN"
      ? "/admin"
      : role === "SUPPORT_AGENT"
        ? "/admin/cms/submissions"
        : "/admin/cms";
  const homeSpace = isAdmin ? adminHome : isB2B ? "/b2b" : "/dashboard";

  // Logged-in users landing on the wrong space get bounced to their own
  if (
    isLoggedIn &&
    (pathname === "/dashboard" || pathname === "/admin" || pathname === "/b2b") &&
    pathname !== homeSpace
  ) {
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
    if (role !== "ADMIN") {
      const allowed =
        role === "SUPPORT_AGENT"
          ? pathname.startsWith("/admin/cms/submissions")
          : pathname.startsWith("/admin/cms");
      if (!allowed) return NextResponse.redirect(new URL(adminHome, req.url));
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
    const approved = req.auth?.user?.b2bStatus?.toLowerCase() === "approved";
    const allowedBeforeApproval = pathname === "/b2b" || pathname === "/b2b/profile";
    if (!approved && !allowedBeforeApproval) {
      return NextResponse.redirect(new URL("/b2b", req.url));
    }
    if (req.auth?.user?.b2bType?.toUpperCase() === "AGENCY" && pathname === "/b2b/sales") {
      return NextResponse.redirect(new URL("/b2b", req.url));
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
