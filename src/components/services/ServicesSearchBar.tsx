import { Search, X } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface ServicesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServicesSearchBar({ value, onChange }: ServicesSearchBarProps) {
  const { t } = useCalmaLang();
  return (
    <div className="relative mt-5 max-w-[560px]">
      <Search
        size={18}
        className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-calma-taupe"
      />
      <input
        type="text"
        placeholder={t.svc.searchPh}
        className="h-12 w-full rounded-full border border-calma-ink/20 bg-white ps-11 pe-11 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe focus:border-calma-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label={t.svc.clearSearch}
          onClick={() => onChange("")}
          className="absolute end-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-calma-taupe transition-colors hover:bg-calma-sand hover:text-calma-ink"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
