"use client";
import React from "react";
import { CALMA_DICT, useOptionalCalmaLang } from "@/lib/calma/i18n";

export default function CalmaPromoTicker() {
  const messages = useOptionalCalmaLang()?.t.tickerMessages ?? CALMA_DICT.fr.tickerMessages;
  const loop = [...messages, ...messages];

  return (
    <div className="fixed inset-x-0 top-0 z-40 h-9 w-full max-w-full overflow-hidden bg-calma-olive-deeper">
      <div className="ticker-wrap flex h-full w-full max-w-full items-center">
        <div className="ticker-content">
          {loop.map((msg, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot">●</span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
