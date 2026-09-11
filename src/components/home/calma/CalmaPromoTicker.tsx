"use client";
import React from "react";

const MESSAGES = [
  "☀️ ÉTÉ 2026 — RÉSERVEZ MAINTENANT",
  "RÉPONSE GARANTIE SOUS 30 MINUTES",
  "−15% SUR LES RÉSERVATIONS ANTICIPÉES",
  "GUIDES LOCAUX · PRIX JUSTES · ZÉRO STRESS",
  "SUPPORT 24/7 EN FRANÇAIS, ANGLAIS & ARABE",
];

export default function CalmaPromoTicker() {
  const loop = [...MESSAGES, ...MESSAGES];

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
