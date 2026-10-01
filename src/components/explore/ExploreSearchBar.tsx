import { Search } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface ExploreSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExploreSearchBar({ value, onChange }: ExploreSearchBarProps) {
  const { t } = useCalmaLang();
  return (
    <div className="relative mt-5 max-w-[560px]">
      <Search
        size={18}
        className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-calma-taupe"
      />
      <input
        type="text"
        placeholder={t.exp.searchPh}
        className="h-12 w-full rounded-full border border-calma-ink/20 bg-white ps-11 pe-4 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe focus:border-calma-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
