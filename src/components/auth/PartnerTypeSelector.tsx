import { Store, Compass, type LucideIcon } from "lucide-react";
import type { PartnerType } from "@/hooks/auth/useAuthForm";

const PARTNER_TYPES: { value: PartnerType; label: string; icon: LucideIcon; desc: string }[] = [
  {
    value: "artisan",
    label: "Artisan",
    icon: Store,
    desc: "Vendez vos créations sur la Marketplace.",
  },
  { value: "agency", label: "Agence", icon: Compass, desc: "Publiez vos circuits sur Explorer." },
];

interface PartnerTypeSelectorProps {
  value: PartnerType;
  onChange: (value: PartnerType) => void;
  labelClassName: string;
}

export function PartnerTypeSelector({ value, onChange, labelClassName }: PartnerTypeSelectorProps) {
  return (
    <div>
      <label className={labelClassName}>Vous êtes</label>
      <div className="grid grid-cols-2 gap-2">
        {PARTNER_TYPES.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-[12px] font-semibold transition-all duration-300 ${
              value === opt.value
                ? "border-calma-terracotta bg-calma-terracotta/10 text-calma-terracotta"
                : "border-calma-olive/15 bg-white/70 text-calma-taupe hover:border-calma-olive/30"
            }`}
          >
            <opt.icon size={15} />
            {opt.label}
          </button>
        ))}
      </div>
      <p className="mt-1 text-[11px] leading-snug text-calma-taupe">
        {PARTNER_TYPES.find((t) => t.value === value)?.desc} Soumis à validation par notre équipe.
      </p>
    </div>
  );
}
