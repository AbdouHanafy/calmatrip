"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";

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
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3"
    >
      {open && (
        <div className="w-72 rounded-2xl bg-white shadow-2xl border p-5 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Chat with our team
            </h3>

            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Choose who you would like to speak with.
          </p>

          <div className="space-y-3">
            
            <a
              href="https://wa.me/21621622972?text=Hello%20Hazem!"
              target="_blank"
              className="flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-600 text-white py-3 font-medium transition"
            >
              💬 Speak with Hazem
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-[#25D366] hover:scale-105 transition shadow-2xl flex items-center justify-center"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}