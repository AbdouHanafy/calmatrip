'use client';

import Link from "next/link";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Plane } from "lucide-react";

type AuthPageProps = {
  mode: "login" | "register";
  callbackUrl?: string;
};

export function AuthPage({ mode, callbackUrl = "/dashboard" }: AuthPageProps) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0A1A2F] via-[#0F2740] to-[#1B4F6E] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#87CEEB] rounded-full blur-[120px] opacity-15" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD700] rounded-full blur-[140px] opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4CAF50] rounded-full blur-[160px] opacity-5" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L45 15 L30 30 L15 15 Z" fill="#87CEEB" fillOpacity="0.5" />
              <circle cx="30" cy="30" r="2" fill="#FFD700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-pattern)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#87CEEB] via-[#4CAF50] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#87CEEB]/20 group-hover:scale-105 transition-transform duration-300">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
              Calmatrip
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 id="auth-heading" className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin
                ? "Sign in with your Google account to access your dashboard"
                : "Sign up with Google to book services and manage your trips"}
            </p>
          </div>

          <GoogleAuthButton
            callbackUrl={callbackUrl}
            label={isLogin ? "Sign in with Google" : "Sign up with Google"}
          />

          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to our terms of service and privacy policy.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isLogin ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-[#87CEEB] font-semibold hover:text-[#4CAF50] transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-white/50 hover:text-[#87CEEB] transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
