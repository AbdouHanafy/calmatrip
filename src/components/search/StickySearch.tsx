"use client";
import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

// Keeps the homepage search reachable after the hero scrolls away. It is the SAME bar
// (same state, never remounted): once its slot scrolls under the site header the bar
// is pinned just below the header on desktop; on phones, where the stacked form is
// too tall to pin, it is hidden and replaced by a small "Search" pill that scrolls
// back up to it.
export default function StickySearch({
  children,
}: {
  children: (stuck: boolean) => React.ReactNode;
}) {
  const { t } = useCalmaLang();
  const slotRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [headerH, setHeaderH] = useState(64);
  const [slotH, setSlotH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const header = document.querySelector("header");
    const measureHeader = () => setHeaderH(header?.getBoundingClientRect().height ?? 64);
    measureHeader();

    const update = () => {
      // Pinned once the bar's slot has moved up behind the header.
      setStuck(
        slot.getBoundingClientRect().bottom <= (header?.getBoundingClientRect().height ?? 64),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measureHeader);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measureHeader);
    };
  }, []);

  // Remember the bar's natural height so the page doesn't jump when it is pinned.
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stuck || !innerRef.current) return;
    const el = innerRef.current;
    const ro = new ResizeObserver(() => setSlotH(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [stuck]);

  const backToSearch = () => {
    const top = (slotRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - headerH - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <>
      <div ref={slotRef} style={stuck && slotH ? { height: slotH } : undefined}>
        <div
          ref={innerRef}
          style={stuck ? { top: headerH } : undefined}
          className={
            stuck
              ? "fixed inset-x-0 z-30 hidden border-b border-calma-ink/10 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur lg:flex lg:justify-center"
              : ""
          }
        >
          {children(stuck)}
        </div>
      </div>

      {stuck && (
        <button
          type="button"
          onClick={backToSearch}
          style={{ top: headerH + 8 }}
          className="fixed end-3 z-30 inline-flex items-center gap-2 rounded-full bg-calma-ink px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg lg:hidden"
        >
          <Search size={16} />
          {t.home.searchBtn}
        </button>
      )}
    </>
  );
}
