'use client';
import React, { useState } from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogIn, LogOut, Search } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/explore", label: "Explore" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — serif style like the image */}
          <Link href="/" className="flex-shrink-0">
            <span
              className="text-2xl font-bold text-[#1B4D3E] tracking-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Calma Trip
            </span>
          </Link>

          {/* Desktop Nav Links — centered */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  pathname === link.path
                    ? "text-[#1B4D3E] font-semibold"
                    : "text-gray-600 hover:text-[#1B4D3E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Search + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search pill */}
            <div className="flex items-center gap-2 bg-[#1B2D2A] rounded-full px-4 py-2 w-52">
              <Search className="w-4 h-4 text-white flex-shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-gray-300 placeholder-gray-400 outline-none w-full"
              />
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1B4D3E] transition-colors px-2 py-1"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <span>{session.user?.name?.split(" ")[0] ?? "Account"}</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-[#1B4D3E] px-2 py-1 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 px-2 py-1 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1B4D3E] transition-colors px-2 py-1"
                >
                  <span>Log in</span>
                  <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-1">
            {/* Mobile search */}
            <div className="flex items-center gap-2 bg-[#1B2D2A] rounded-full px-4 py-2.5 mb-3">
              <Search className="w-4 h-4 text-white flex-shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="bg-transparent text-sm text-gray-300 placeholder-gray-400 outline-none w-full"
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                  pathname === link.path
                    ? "text-[#1B4D3E] font-semibold bg-[#1B4D3E]/5"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-gray-100 my-2" />

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="mx-4 mt-2 px-4 py-2.5 border border-gray-200 text-sm text-gray-700 rounded-lg text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mx-4 mt-2 px-4 py-2.5 bg-[#1B4D3E] text-white text-sm text-center font-medium rounded-lg"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};