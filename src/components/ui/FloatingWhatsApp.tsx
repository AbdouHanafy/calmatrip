"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.657 4.527 1.797 6.39L4 29l7.79-1.76A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75c-1.94 0-3.75-.55-5.29-1.5l-.38-.23-4.62 1.04 1.06-4.5-.25-.39A9.7 9.7 0 0 1 5.25 15c0-5.93 4.82-10.75 10.754-10.75S26.76 9.07 26.76 15 21.94 24.75 16.004 24.75Zm5.86-8.06c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.38.24-.7.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.75-.99-2.39-.26-.63-.53-.55-.72-.56h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.1 1.31 3.32.16.21 2.26 3.46 5.48 4.85.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 font-hanken"
    >
      {open && (
        <div
          className="w-72 rounded-calma-card border border-calma-olive/10 bg-calma-cream p-5 animate-in fade-in zoom-in duration-200"
          style={{ boxShadow: "0 28px 60px -24px rgba(42,38,34,.4)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-calma-olive text-calma-cream">
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="font-fraunces text-[16px] font-normal text-calma-ink">
                Discutez avec nous
              </h3>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="text-calma-taupe transition-colors hover:text-calma-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-calma-taupe">
            Une question sur votre voyage ? Notre équipe vous répond en direct sur WhatsApp.
          </p>

          <a
            href="https://wa.me/21621622972?text=Bonjour%20!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-calma-olive px-5 py-3 text-[14.5px] font-semibold text-calma-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-calma-olive-deep"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Écrire sur WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir le chat WhatsApp"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-calma-olive text-calma-cream shadow-[0_18px_36px_-14px_rgba(42,38,34,.5)] transition-transform duration-300 hover:scale-105"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </button>
    </div>
  );
}
