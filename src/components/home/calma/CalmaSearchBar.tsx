"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Calendar, Compass, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export default function CalmaSearchBar() {
  const { t } = useCalmaLang();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("search", destination.trim());
    if (date.trim()) params.set("date", date.trim());
    if (category) params.set("category", category);
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const categoryOptions = [
    { value: "", label: t.searchCat },
    { value: "culture", label: t.icCulture },
    { value: "medina", label: t.icMedina },
    { value: "beach", label: t.icBeach },
    { value: "desert", label: t.icDesert },
    { value: "food", label: t.icFood },
    { value: "adventure", label: t.icAdv },
  ];

  return (
    <>
      {/* Mobile-only compact booking card — desktop/tablet block below (hidden md:block) is untouched */}
      <div className="relative z-[15] mx-auto -mt-10 max-w-[420px] px-4 md:hidden">
        <motion.form
          onSubmit={onSubmit}
          className="flex flex-col gap-2.5 rounded-[28px] border border-white/60 bg-white/95 p-4 backdrop-blur-2xl"
          style={{ boxShadow: "0 24px 56px -20px rgba(42,38,34,.45)" }}
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-calma-border/50 bg-calma-sand/40 px-4 py-2 transition-colors focus-within:border-calma-terracotta/50 focus-within:bg-calma-terracotta/[.06]">
            <MapPin size={20} className="shrink-0 text-calma-terracotta" />
            <div className="min-w-0 flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-[.06em] text-calma-taupe">
                {t.searchDestL}
              </div>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t.searchDest}
                className="w-full truncate border-none bg-transparent p-0 font-hanken text-[16px] text-calma-ink outline-none placeholder:text-calma-taupe/60"
              />
            </div>
          </label>

          <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-calma-border/50 bg-calma-sand/40 px-4 py-2 transition-colors focus-within:border-calma-terracotta/50 focus-within:bg-calma-terracotta/[.06]">
            <Calendar size={20} className="shrink-0 text-calma-terracotta" />
            <div className="min-w-0 flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-[.06em] text-calma-taupe">
                {t.searchDateL}
              </div>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder={t.searchDatePh}
                className="w-full truncate border-none bg-transparent p-0 font-hanken text-[16px] text-calma-ink outline-none placeholder:text-calma-taupe/60"
              />
            </div>
          </label>

          <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-calma-border/50 bg-calma-sand/40 px-4 py-2 transition-colors focus-within:border-calma-terracotta/50 focus-within:bg-calma-terracotta/[.06]">
            <Compass size={20} className="shrink-0 text-calma-terracotta" />
            <div className="min-w-0 flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-[.06em] text-calma-taupe">
                {t.searchCatL}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full cursor-pointer border-none bg-transparent p-0 font-hanken text-[16px] text-calma-ink outline-none"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <button
            type="submit"
            className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-full font-hanken text-[16px] font-bold text-white shadow-[0_16px_32px_-10px_rgba(242,153,74,.65)] transition-transform active:scale-[.97]"
            style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
          >
            {t.browse}
            <ArrowRight size={18} />
          </button>
        </motion.form>
      </div>

      {/* Desktop/tablet — unchanged */}
      <div className="relative z-[15] mx-auto -mt-24 hidden max-w-[1040px] px-6 sm:px-10 md:block">
        <motion.form
          onSubmit={onSubmit}
          className="flex flex-wrap items-center gap-2 rounded-[32px] border border-white/60 bg-white/90 p-4 backdrop-blur-2xl transition-shadow duration-300 focus-within:shadow-[0_40px_80px_-28px_rgba(42,38,34,.6)] sm:p-5"
          style={{ boxShadow: "0 32px 70px -26px rgba(42,38,34,.5)" }}
          initial={reduceMotion ? undefined : { opacity: 0, y: 36 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="group block flex-[2_1_240px] rounded-3xl px-6 py-3.5 transition-colors duration-300 hover:bg-calma-terracotta/[.05] focus-within:bg-calma-terracotta/[.07]">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-calma-taupe">
              {t.searchDestL}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="shrink-0 text-calma-terracotta" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t.searchDest}
                className="w-full border-none bg-transparent font-hanken text-[16px] text-calma-ink outline-none placeholder:text-calma-taupe/70"
              />
            </div>
          </label>

          <div className="hidden h-12 w-px bg-calma-olive/[.12] sm:block" />

          <label className="group block flex-[1_1_170px] rounded-3xl px-6 py-3.5 transition-colors duration-300 hover:bg-calma-terracotta/[.05] focus-within:bg-calma-terracotta/[.07]">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-calma-taupe">
              {t.searchDateL}
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="shrink-0 text-calma-terracotta" />
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder={t.searchDatePh}
                className="w-full border-none bg-transparent font-hanken text-[16px] text-calma-ink outline-none placeholder:text-calma-taupe/70"
              />
            </div>
          </label>

          <div className="hidden h-12 w-px bg-calma-olive/[.12] sm:block" />

          <label className="group block flex-[1_1_170px] rounded-3xl px-6 py-3.5 transition-colors duration-300 hover:bg-calma-terracotta/[.05] focus-within:bg-calma-terracotta/[.07]">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-calma-taupe">
              {t.searchCatL}
            </div>
            <div className="flex items-center gap-3">
              <Compass size={20} className="shrink-0 text-calma-terracotta" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full cursor-pointer border-none bg-transparent font-hanken text-[16px] text-calma-ink outline-none"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <button
            type="submit"
            className="group flex min-w-[210px] flex-[1_1_auto] items-center justify-center gap-2.5 rounded-3xl px-8 py-5 font-hanken text-[16px] font-bold text-white shadow-[0_18px_36px_-12px_rgba(242,153,74,.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-12px_rgba(242,153,74,.8)] active:translate-y-0 active:scale-[.98]"
            style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
          >
            {t.browse}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.form>
      </div>
    </>
  );
}
