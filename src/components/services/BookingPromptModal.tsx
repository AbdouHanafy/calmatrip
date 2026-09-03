import Link from "next/link";
import { Check } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export function BookingPromptModal({ onClose }: { onClose: () => void }) {
  const { t } = useCalmaLang();

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4C7A92] flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">{t.svc.modalTitle}</h3>
          <p className="text-gray-500 text-sm">{t.svc.modalSub}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 py-3 bg-[#4C7A92] text-white rounded-2xl font-semibold text-sm text-center hover:bg-[#3A5F70] transition-colors"
          >
            {t.svc.modalLogin}
          </Link>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            {t.svc.modalClose}
          </button>
        </div>
      </div>
    </div>
  );
}
