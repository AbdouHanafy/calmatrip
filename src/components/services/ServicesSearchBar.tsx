import { Search, X } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface ServicesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServicesSearchBar({ value, onChange }: ServicesSearchBarProps) {
  const { t } = useCalmaLang();
  return (
    <section className="relative z-20 -mt-8 mb-2 mx-auto max-w-2xl px-6">
      <div className="relative group" style={{ boxShadow: "0 24px 56px -24px rgba(42,38,34,.5)" }}>
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-calma-taupe transition-colors group-focus-within:text-calma-terracotta" />
        <input
          type="text"
          placeholder={t.svc.searchPh}
          className="w-full h-14 rounded-[28px] border border-white/50 bg-white/90 pl-14 pr-12 text-calma-ink outline-none backdrop-blur-xl transition-all placeholder:text-calma-taupe focus:ring-2 focus:ring-calma-terracotta/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            aria-label={t.svc.clearSearch}
            onClick={() => onChange("")}
            className="absolute right-5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-calma-taupe transition-colors hover:bg-calma-terracotta/10 hover:text-calma-terracotta"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
