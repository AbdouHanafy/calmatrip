import { Search } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface ExploreSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExploreSearchBar({ value, onChange }: ExploreSearchBarProps) {
  const { t } = useCalmaLang();
  return (
    <section className="max-w-2xl mx-auto px-6 -mt-16 relative z-20 mb-10">
      <div className="relative group" style={{ boxShadow: "0 24px 56px -24px rgba(42,38,34,.5)" }}>
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-calma-taupe group-focus-within:text-calma-terracotta transition-colors" />
        <input
          type="text"
          placeholder={t.exp.searchPh}
          className="w-full h-14 rounded-[28px] border border-white/50 bg-white/90 pl-14 pr-6 text-calma-ink outline-none backdrop-blur-xl transition-all placeholder:text-calma-taupe focus:ring-2 focus:ring-calma-terracotta/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </section>
  );
}
