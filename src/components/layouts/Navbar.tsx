'use client';
import React, { useState } from 'react'
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import InstallPWA from "@/components/ui/InstallPWA";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="border-b border-gray-100">
      <InstallPWA />
        {/* Top Bar - Version professionnelle */}
        <div className="hidden lg:block bg-gradient-to-r from-gray-50 to-white py-2">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Phone className="w-3 h-3" />
                  <span>+216 70 000 000</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span>contact@calmatrip.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">|</span>
                <Link
                  href="/faq"
                  className="text-gray-500 hover:text-[#87CEEB] transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/support"
                  className="text-gray-500 hover:text-[#87CEEB] transition-colors"
                >
                  Support
                </Link>
                <span className="text-gray-400">|</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">EN</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#87CEEB] via-[#4CAF50] to-[#FFD700] flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
                  <img src='/images/logo-calma-trip.jpg' />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full shadow-sm"></div>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
                  Calmatrip
                </span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-medium">
                  Travel & Services
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === link.path
                      ? "text-[#4CAF50] bg-[#4CAF50]/5"
                      : "text-gray-600 hover:text-[#4CAF50] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                  {pathname === link.path && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#4CAF50] rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>{session.user?.name?.split(" ")[0] ?? "Dashboard"}</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#4CAF50] rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#4CAF50] rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign in</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white text-sm font-semibold rounded-lg hover:shadow-md hover:shadow-[#4CAF50]/20 hover:scale-105 transition-all duration-300"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#4CAF50]" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-1">
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === link.path
                        ? "bg-gradient-to-r from-[#87CEEB]/10 to-[#4CAF50]/10 text-[#4CAF50] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-gray-100 my-2"></div>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                      My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="mx-4 my-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-center font-medium rounded-lg w-[calc(100%-2rem)]"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mx-4 my-2 px-4 py-2.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white text-center font-medium rounded-lg"
                    >
                      Sign up
                    </Link>
                  </>
                )}

                {/* Mobile Contact Info */}
                <div className="mt-4 pt-4 border-t border-gray-100 px-4 space-y-2">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>+216 70 000 000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>contact@calmatrip.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
