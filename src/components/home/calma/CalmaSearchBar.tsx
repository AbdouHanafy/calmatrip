"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Calendar, Compass, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { CalmaFieldSelect } from "./CalmaFieldSelect";

const DESTINATION_OPTIONS = ["Hammamet"];
const TODAY_ISO = () => new Date().toISOString().slice(0, 10);

export default function CalmaSearchBar() {
  const { t } = useCalmaLang();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [destination, setDestination] = useState(DESTINATION_OPTIONS[0]);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (category) params.set("category", category);
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const destinationOptions = DESTINATION_OPTIONS.map((d) => ({ value: d, label: d }));

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
      <div className="relative z-[15] mx-auto -mt-8 max-w-[400px] px-4 md:hidden">
        <motion.form
          onSubmit={onSubmit}
          className="flex flex-col gap-1.5 rounded-[26px] border border-white/50 bg-white/95 p-3 shadow-[0_20px_48px_-18px_rgba(21,36,46,.4)] backdrop-blur-2xl"
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="flex min-h-[46px] items-center gap-2.5 rounded-2xl border border-calma-border/50 bg-calma-sand/40 px-3.5 py-1.5 transition-colors focus-within:border-calma-terracotta/50 focus-within:bg-calma-terracotta/[.06]">
            <MapPin size={18} className="shrink-0 text-calma-terracotta" />
            <div className="min-w-0 flex-1 text-start">
              <div className="text-[9px] font-bold uppercase tracking-[.06em] text-calma-taupe">
                {t.searchDestL}
              </div>
              <CalmaFieldSelect
                value={destination}
                options={destinationOptions}
                onChange={setDestination}
                triggerClassName="text-[15px] text-calma-ink"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex min-h-[46px] items-center gap-2 rounded-2xl border border-calma-border/50 bg-calma-sand/40 px-3 py-1.5 transition-colors focus-within:border-calma-terracotta/50 focus-within:bg-calma-terracotta/[.06]">
              <Calendar size={16} className="shrink-0 text-calma-terracotta" />
              <div className="min-w-0 flex-1 text-start">
                <div className="text-[9px] font-bold uppercase tracking-[.06em] text-calma-taupe">
                  {t.searchDateL}
                </div>
                <input
                  type="date"
                  min={TODAY_ISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full truncate border-none bg-transparent p-0 font-hanken text-[13.5px] text-calma-ink outline-none [color-scheme:light]"
                />
              </div>
            </label>

            <label className="flex min-h-[46px] items-center gap-2 rounded-2xl border border-calma-border/50 bg-calma-sand/40 px-3 py-1.5 transition-colors focus-within:border-calma-terracotta/50 focus-within:bg-calma-terracotta/[.06]">
              <Compass size={16} className="shrink-0 text-calma-terracotta" />
              <div className="min-w-0 flex-1 text-start">
                <div className="text-[9px] font-bold uppercase tracking-[.06em] text-calma-taupe">
                  {t.searchCatL}
                </div>
                <CalmaFieldSelect
                  value={category}
                  options={categoryOptions}
                  onChange={setCategory}
                  triggerClassName="text-[13.5px] text-calma-ink"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="mt-0.5 flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-calma-terracotta font-hanken text-[15px] font-bold text-calma-ink shadow-[0_14px_28px_-8px_rgba(210,179,139,.65)] transition-transform active:scale-[.97]"
          >
            {t.browse}
            <ArrowRight size={17} className="rtl:rotate-180" />
          </button>
        </motion.form>
      </div>

      {/* Desktop/tablet — unchanged */}
      <div className="relative z-[15] mx-auto -mt-16 hidden max-w-[900px] px-6 sm:px-10 md:block">
        <motion.form
          onSubmit={onSubmit}
          className="flex flex-wrap items-center gap-1 rounded-[28px] border border-white/60 bg-white/90 p-2 backdrop-blur-2xl transition-shadow duration-300 focus-within:shadow-[0_32px_64px_-24px_rgba(21,36,46,.6)]"
          style={{ boxShadow: "0 24px 56px -22px rgba(21,36,46,.5)" }}
          initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="group block min-w-0 flex-[2_1_180px] rounded-full px-4 py-2 transition-colors duration-300 hover:bg-calma-terracotta/[.05] focus-within:bg-calma-terracotta/[.07]">
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-calma-taupe">
              {t.searchDestL}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-calma-terracotta" />
              <CalmaFieldSelect
                value={destination}
                options={destinationOptions}
                onChange={setDestination}
                triggerClassName="text-[14px] text-calma-ink"
              />
            </div>
          </label>

          <div className="hidden h-8 w-px shrink-0 bg-calma-olive/[.12] sm:block" />

          <label className="group block min-w-0 flex-[1_1_130px] rounded-full px-4 py-2 transition-colors duration-300 hover:bg-calma-terracotta/[.05] focus-within:bg-calma-terracotta/[.07]">
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-calma-taupe">
              {t.searchDateL}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="shrink-0 text-calma-terracotta" />
              <input
                type="date"
                min={TODAY_ISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-none bg-transparent font-hanken text-[14px] text-calma-ink outline-none [color-scheme:light]"
              />
            </div>
          </label>

          <div className="hidden h-8 w-px shrink-0 bg-calma-olive/[.12] sm:block" />

          <label className="group block min-w-0 flex-[1_1_130px] rounded-full px-4 py-2 transition-colors duration-300 hover:bg-calma-terracotta/[.05] focus-within:bg-calma-terracotta/[.07]">
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-calma-taupe">
              {t.searchCatL}
            </div>
            <div className="flex items-center gap-2">
              <Compass size={16} className="shrink-0 text-calma-terracotta" />
              <CalmaFieldSelect
                value={category}
                options={categoryOptions}
                onChange={setCategory}
                triggerClassName="text-[14px] text-calma-ink"
              />
            </div>
          </label>

          <button
            type="submit"
            className="group flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-calma-terracotta px-5 py-3 font-hanken text-[14px] font-bold text-calma-ink shadow-[0_12px_24px_-10px_rgba(210,179,139,.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-10px_rgba(210,179,139,.8)] active:translate-y-0 active:scale-[.98]"
          >
            {t.browse}
            <ArrowRight
              size={15}
              className="rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </button>
        </motion.form>
      </div>
    </>
  );
}
