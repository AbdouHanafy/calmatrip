"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, Phone, User as UserIcon, Loader2, ArrowRight } from "lucide-react";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s]{8,20}$/;

interface AccountStepProps {
  t: CalmaPartnerOnboardingDict;
  onCreated: () => void;
}

export function AccountStep({ t, onCreated }: AccountStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputBoxClass =
    "flex h-12 items-center gap-2.5 rounded-xl border border-calma-olive/15 bg-white/80 px-3.5 transition-all duration-300 focus-within:border-calma-terracotta focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(210,179,139,.12)]";
  const inputFieldClass =
    "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/55";
  const labelClass = "mb-1.5 block text-[13px] font-semibold text-calma-ink";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) return setError(t.requiredError);
    if (!EMAIL_RE.test(email.trim())) return setError(t.requiredError);
    if (!PHONE_RE.test(phone.trim())) return setError(t.requiredError);
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return setError(t.requiredError);
    }
    if (password !== confirmPassword) return setError(t.requiredError);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          accountType: "user", // partner type is chosen in the next step
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.requiredError);
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(t.requiredError);
        setLoading(false);
        return;
      }

      onCreated();
    } catch {
      setError(t.requiredError);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-1 font-fraunces text-[22px] font-normal text-calma-ink">
        {t.accountTitle}
      </h2>
      <p className="mb-5 text-[13.5px] text-calma-taupe">{t.accountSub}</p>

      <GoogleAuthButton
        callbackUrl="/partner/register"
        label="Continue with Google"
        accountType="user"
      />

      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-calma-olive/15" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-calma-taupe/70">
          or
        </span>
        <div className="h-px flex-1 bg-calma-olive/15" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
        />

        <div>
          <label htmlFor="pnr-name" className={labelClass}>
            {t.accountNameLabel}
          </label>
          <div className={inputBoxClass}>
            <UserIcon size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputFieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pnr-email" className={labelClass}>
            {t.accountEmailLabel}
          </label>
          <div className={inputBoxClass}>
            <Mail size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputFieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pnr-phone" className={labelClass}>
            {t.accountPhoneLabel}
          </label>
          <div className={inputBoxClass}>
            <Phone size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+216 XX XXX XXX"
              className={inputFieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pnr-password" className={labelClass}>
            {t.accountPasswordLabel}
          </label>
          <div className={inputBoxClass}>
            <Lock size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputFieldClass}
            />
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        <div>
          <label htmlFor="pnr-confirm" className={labelClass}>
            {t.accountConfirmLabel}
          </label>
          <div className={inputBoxClass}>
            <Lock size={18} className="shrink-0 text-calma-terracotta" />
            <input
              id="pnr-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputFieldClass}
            />
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[15px] font-bold text-calma-cream shadow-[0_16px_32px_-12px_rgba(210,179,139,.65)] transition-shadow duration-300 hover:shadow-[0_22px_40px_-12px_rgba(210,179,139,.8)] disabled:opacity-70"
          style={{ backgroundColor: "#D2B38B" }}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              {t.accountSubmitBtn}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-[12.5px] text-calma-taupe">
        {t.accountHaveAccount}{" "}
        <Link
          href="/partner/login"
          className="font-semibold text-calma-terracotta transition-colors hover:text-calma-olive"
        >
          {t.accountLoginLink}
        </Link>
      </p>
    </div>
  );
}
