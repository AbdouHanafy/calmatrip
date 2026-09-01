import type { LucideIcon } from "lucide-react";

export interface StatusPillConfig {
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
  label: string;
}

/** A small colored status pill — the shared visual language every collection's status column uses. */
export function StatusPill({ config }: { config: StatusPillConfig }) {
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
